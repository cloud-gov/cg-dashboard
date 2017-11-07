package testhelpers

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gocraft/web"
	"github.com/gorilla/sessions"
	"github.com/govau/cf-common/env"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"golang.org/x/oauth2"

	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/helpers/testhelpers/mocks"
)

// MockSessionStore represents an easily fillable session store that implements
// gorilla's session store interface.
type MockSessionStore struct {
	Session            *sessions.Session
	currentSessionName string
	Options            *sessions.Options
}

// Get simply returns the session that has pre populated beforehand with ResetSessionData
// or will return nil if the session name that is given is 'nilSession'
func (store MockSessionStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	if store.currentSessionName == "nilSession" {
		return nil, nil
	}
	return store.Session, nil
}

// New returns the current session. Does not create a new one. Not needed for mock sessions.
func (store MockSessionStore) New(r *http.Request, name string) (*sessions.Session, error) {
	return store.Session, nil
}

// Save returns nil error. We save session data by using ResetSessionData
func (store MockSessionStore) Save(r *http.Request, w http.ResponseWriter, s *sessions.Session) error {
	return nil
}

// ResetSessionData zero initializes the MockSessionStore and then will copy the input session data into it.
func (store *MockSessionStore) ResetSessionData(data map[string]interface{}, sessionName string) {
	store.Options = &sessions.Options{
		Path:   "/",
		MaxAge: 86400 * 30,
	}
	// Initialize the map to empty.
	store.Session = sessions.NewSession(store, sessionName)
	for key, value := range data {
		store.Session.Values[key] = value
	}
	store.currentSessionName = sessionName
	opts := *store.Options
	store.Session.Options = &opts
}

// NewTestRequest is a helper function that creates a sample request with the given input parameters.
func NewTestRequest(method, path string, body []byte) (*httptest.ResponseRecorder, *http.Request) {
	var request *http.Request
	if body != nil {
		request, _ = http.NewRequest(method, path, bytes.NewBuffer(body))
	} else {
		request, _ = http.NewRequest(method, path, nil)
	}
	recorder := httptest.NewRecorder()

	return recorder, request
}

// InvalidTokenData is a dataset which represents an invalid token. Useful for unit tests.
var InvalidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: (time.Now()).Add(-1 * time.Minute), AccessToken: "invalidsampletoken"},
}

// ValidTokenData is a dataset which represents a valid token. Useful for unit tests.
var ValidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: time.Time{}, AccessToken: "sampletoken"},
}

// EchoResponseHandler is a normal handler for responses received from the proxy requests.
func EchoResponseHandler(rw http.ResponseWriter, response *http.Response) {
	for header := range response.Header {
		// fmt.Println("DEBUG GENERIC HANDLER", header, response.Header.Get(header))
		rw.Header().Add(header, response.Header.Get(header))
	}

	// Write the body into response that is going back to the frontend.
	_, err := io.Copy(rw, response.Body)
	if err != nil {
		log.Println(err)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("unknown error. try again"))
		return
	}
}

// CreateRouterWithMockSession will create a settings with the appropriate envVars and load the mock session with the session data.
func CreateRouterWithMockSession(sessionData map[string]interface{}, envVars map[string]string) (*web.Router, *MockSessionStore) {
	// Initialize settings.
	settings := helpers.Settings{}
	app, _ := cfenv.Current()
	settings.InitSettings(env.NewVarSet(env.WithMapLookup(envVars)), app)

	// Initialize a new session store.
	store := MockSessionStore{}
	store.ResetSessionData(sessionData, "")

	// Override the session store.
	settings.Sessions = store

	templates, err := helpers.InitTemplates(settings.TemplatesPath)
	if err != nil {
		log.Fatalf("failed to init templates: %v", err)
	}

	// Create the router.
	mockMailer := new(mocks.Mailer)
	// mockery converts []byte to []uint8 thus having to check for that in the
	// argument.
	mockMailer.On("SendEmail", mock.AnythingOfType("string"),
		mock.AnythingOfType("string"), mock.AnythingOfType("[]uint8")).Return(nil)
	router := controllers.InitRouter(&settings, templates, mockMailer)

	return router, &store
}

// BasicConsoleUnitTest is Basic Unit Test Information.
type BasicConsoleUnitTest struct {
	// Name of the tests
	TestName string
	// Set of env vars to set up the settings.
	EnvVars map[string]string
	// Ending location of request.
	Location    string
	Code        int
	SessionData map[string]interface{}
}

// ResponseContentTester can check a response for equivalency
type ResponseContentTester interface {
	// Check should return true if the resp matches the expected false, and false otherwise
	Check(t assert.TestingT, resp string) bool

	// Display returns the expected string suitable for an error message
	Display() string
}

type jsonContentTester struct {
	Expected string
}

func (jct *jsonContentTester) Check(t assert.TestingT, resp string) bool {
	return assert.JSONEq(t, jct.Expected, resp)
}

func (jct *jsonContentTester) Display() string {
	return jct.Expected
}

// NewJSONResponseContentTester creates a content matcher where the content
// being tested is JSON.
func NewJSONResponseContentTester(expected string) ResponseContentTester {
	return &jsonContentTester{
		Expected: expected,
	}
}

type stringContentTester struct {
	Expected string
}

func (sct *stringContentTester) Check(t assert.TestingT, resp string) bool {
	return assert.Equal(t, sct.Expected, resp)
}

func (sct *stringContentTester) Display() string {
	return sct.Expected
}

// NewStringContentTester returns an content matcher where the content
// being tested is a string.
func NewStringContentTester(expected string) ResponseContentTester {
	return &stringContentTester{
		Expected: expected,
	}
}

// BasicSecureTest contains info like BasicConsoleUnitTest.
// TODO consolidate BasicConsoleUnitTest and BasicSecureTest
type BasicSecureTest struct {
	BasicConsoleUnitTest
	ExpectedCode     int
	ExpectedResponse ResponseContentTester
	ExpectedLocation string
	ExpectedHeaders  map[string]string
}

// Handler is a specific handler for the test server.
type Handler struct {
	// The response the test 'external' Cloud Foundry server should send back.
	Response string
	// The code the test 'external' Cloud Foundry server should send back.
	ResponseCode int
	// ExpectedPath is the path that the test 'external' Cloud Foundry server we setup should receive.
	// This is useful as we translate our endpoints to conform with the Cloud Foundry APIs.
	// e.g. our endpoint: /uaa/userinfo & Cloud Foundry endpoint: /userinfo
	ExpectedPath string
	// RequestMethod is the method the external server should be waiting for.
	RequestMethod string
}

// BasicProxyTest contains information for what our test 'external' server should do when the proxy methods contact it.
type BasicProxyTest struct {
	BasicSecureTest
	// RequestPath is the path that our test client should send.
	RequestPath string
	// RequestBody is the body that our test client should send.
	RequestBody []byte
	// Handlers is the list of handlers to use to respond for the server.
	Handlers []Handler
	// RequestMethod is the type of method that our test client should send.
	RequestMethod string
	// RequestHeaders is a map of headers that our test client should send.
	RequestHeaders map[string]string
}

// GetMockCompleteEnvVars is just a commonly used env vars object that contains non-empty values for all the fields of the EnvVars struct.
func GetMockCompleteEnvVars() map[string]string {
	return map[string]string{
		helpers.ClientIDEnvVar:              "ID",
		helpers.ClientSecretEnvVar:          "Secret",
		helpers.HostnameEnvVar:              "https://hostname",
		helpers.LoginURLEnvVar:              "https://loginurl",
		helpers.UAAURLEnvVar:                "https://uaaurl",
		helpers.APIURLEnvVar:                "https://apiurl",
		helpers.LogURLEnvVar:                "https://logurl",
		helpers.PProfEnabledEnvVar:          "true",
		helpers.SessionBackendEnvVar:        "cookiestore",
		helpers.SessionEncryptionEnvVar:     "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
		helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
		helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		helpers.TemplatesPathEnvVar:         filepath.Join(os.Getenv("TEST_ROOT_PATH"), "templates"),
		helpers.SMTPFromEnvVar:              "cloud@cloud.gov",
		helpers.SMTPHostEnvVar:              "localhost",
		helpers.SecureCookiesEnvVar:         "1",
		helpers.TICSecretEnvVar:             "tic",
	}
}

// CreateExternalServerForPrivileged creates a test server that should reply
// with the given parameters assuming that the incoming request matches what
// we want. This call will be with the HighPrivilegedOauthClient.
func CreateExternalServerForPrivileged(t *testing.T, test BasicProxyTest) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		privilegedToken := "90d64460d14870c08c81352a05dedd3465940a7c"
		if r.URL.String() == "/oauth/token" {

			if got, want := r.Header.Get("Content-Type"), "application/x-www-form-urlencoded"; got != want {
				t.Errorf("Content-Type header = %q; want %q", got, want)
			}
			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				r.Body.Close()
			}
			if err != nil {
				t.Errorf("failed reading request body: %s.", err)
			}
			expectedRequestBody := "client_id=" + GetMockCompleteEnvVars()[helpers.ClientIDEnvVar] + "&grant_type=client_credentials&scope=scim.invite+cloud_controller.admin+scim.read"
			if string(body) != expectedRequestBody {
				t.Errorf("payload = %q; want %q", string(body), expectedRequestBody)
			}
			w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
			// Write the privileged token so that it can be used.
			w.Write([]byte("access_token=" + privilegedToken + "&token_type=bearer"))
		} else {
			foundHandler := false
			for _, handler := range test.Handlers {
				if r.URL.RequestURI() == handler.ExpectedPath && r.Method == handler.RequestMethod {
					// Echo request headers to response headers
					for header := range r.Header {
						w.Header().Add(header, r.Header.Get(header))
					}

					w.WriteHeader(handler.ResponseCode)
					fmt.Fprintln(w, handler.Response)
					foundHandler = true

					// Check that we are using the privileged token
					// This line here is why we can't use the generic CreateExternalServer.
					// Could add a token parameter. TODO
					headerAuth := r.Header.Get("Authorization")
					if headerAuth == "Basic "+privilegedToken {
						t.Errorf("Unexpected authorization header, %v is found.", headerAuth)
					}
					break
				}
			}
			if !foundHandler {
				t.Errorf("Test name: (%s) Server received method %s\n", test.TestName, r.Method)
				t.Errorf("Debug path: Got stuck on (%s) after frontend sent (%s)\n", r.URL.RequestURI(), test.RequestPath)
				t.Errorf("Tried the following handlers %+v\n", test.Handlers)
			}
		}
	}))
}

// CreateExternalServer creates a test server that should reply with the given parameters assuming that the incoming request matches what we want.
func CreateExternalServer(t *testing.T, test *BasicProxyTest) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		foundHandler := false
		for _, handler := range test.Handlers {
			if r.URL.RequestURI() == handler.ExpectedPath && r.Method == handler.RequestMethod {
				foundHandler = true

				// Echo request headers to response headers
				for header := range r.Header {
					w.Header().Add(header, r.Header.Get(header))
				}

				w.WriteHeader(handler.ResponseCode)
				fmt.Fprintln(w, handler.Response)
				headerAuth := r.Header.Get("Authorization")
				oauthToken, ok := test.SessionData["token"].(oauth2.Token)
				if ok {
					if headerAuth != "Bearer "+oauthToken.AccessToken {
						t.Errorf("Unexpected authorization header, (%v) is found. Expected %s", headerAuth, oauthToken.AccessToken)
					}
				} else {
					t.Errorf("Error converting to Session data to oauth.Token struct")
				}
			}
		}
		if !foundHandler {
			t.Errorf("Test name: (%s) Server received method %s\n", test.TestName, r.Method)
			t.Errorf("Debug path: Got (%s) sent (%s)\n", r.URL.Path, test.RequestPath)
			t.Errorf("Tried the following handlers %+v\n", test.Handlers)
		}
	}))
}

// PrepareExternalServerCall creates all the things that we will use when we send the request to the external server.
// This includes setting up the routes, create a test response recorder and a test request.
func PrepareExternalServerCall(t *testing.T, c *controllers.SecureContext, testServer *httptest.Server, fullURL string, test BasicProxyTest) (*httptest.ResponseRecorder, *http.Request, *web.Router) {
	if token, ok := test.SessionData["token"].(oauth2.Token); ok {
		// Assign token
		c.Token = token

		// Assign settings to context
		mockSettings := &helpers.Settings{}
		app, _ := cfenv.Current()
		mockSettings.InitSettings(
			env.NewVarSet(env.WithMapLookup(test.EnvVars)),
			app,
		)
		c.Settings = mockSettings

		response, request := NewTestRequest(test.RequestMethod, fullURL, test.RequestBody)
		request.RemoteAddr = httptest.DefaultRemoteAddr + ":81"
		request.URL.Scheme = "http"
		request.URL.Host = request.Host
		for header, value := range test.RequestHeaders {
			request.Header.Set(header, value)
		}
		test.EnvVars[helpers.APIURLEnvVar] = testServer.URL
		test.EnvVars[helpers.UAAURLEnvVar] = testServer.URL
		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		return response, request, router
	}
	t.Errorf("Cannot get token data")
	return nil, nil, nil
}

// VerifyExternalCallResponse will verify the test response with what was expected by the test.
func VerifyExternalCallResponse(t *testing.T, response *httptest.ResponseRecorder, test *BasicProxyTest) {
	// Check response.
	if !test.ExpectedResponse.Check(t, strings.TrimSpace(response.Body.String())) {
		t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.TestName, test.ExpectedResponse.Display(), response.Body.String())
	}
	if response.Code != test.ExpectedCode {
		t.Errorf("Test %s did not meet expected code. Expected %d. Found %d.\n", test.TestName, test.ExpectedCode, response.Code)
	}
	for header, value := range test.ExpectedHeaders {
		observed := response.Header().Get(header)
		if value != observed {
			t.Errorf("Test %s request header %s mismatch. Expected %s. Found %s.\n", test.TestName, header, value, observed)
		}
	}
}
