package testhelpers

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gocraft/web"
	"github.com/gorilla/sessions"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/helpers"
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

// CreateRouterWithMockSession will create a settings with the appropriate envVars and load the mock session with the session data.
func CreateRouterWithMockSession(sessionData map[string]interface{}, envVars helpers.EnvVars) (*web.Router, *MockSessionStore) {
	// Initialize settings.
	settings := helpers.Settings{}
	env, _ := cfenv.Current()
	settings.InitSettings(envVars, env)

	// Initialize a new session store.
	store := MockSessionStore{}
	store.ResetSessionData(sessionData, "")

	// Override the session store.
	settings.Sessions = store

	// Create the router.
	router := controllers.InitRouter(&settings, &template.Template{})

	return router, &store
}

// BasicConsoleUnitTest is Basic Unit Test Information.
type BasicConsoleUnitTest struct {
	// Name of the tests
	TestName string
	// Set of env vars to set up the settings.
	EnvVars helpers.EnvVars
	// Ending location of request.
	Location    string
	Code        int
	SessionData map[string]interface{}
}

// BasicSecureTest contains info like BasicConsoleUnitTest.
// TODO consolidate BasicConsoleUnitTest and BasicSecureTest
type BasicSecureTest struct {
	BasicConsoleUnitTest
	ExpectedCode     int
	ExpectedResponse string
	ExpectedLocation string
}

// BasicProxyTest contains information for what our test 'external' server should do when the proxy methods contact it.
type BasicProxyTest struct {
	BasicSecureTest
	// RequestMethod is the type of method that our test client should send.
	RequestMethod string
	// RequestPath is the path that our test client should send.
	RequestPath string
	// RequestBody is the body that our test client should send.
	RequestBody []byte
	// ExpectedPath is the path that the test 'external' cloud foundry server we setup should receive.
	// This is useful as we translate our endpoints to conform with the cloud foundry APIs.
	// e.g. our endpoint: /uaa/userinfo & cloud foundry endpoint: /userinfo
	ExpectedPath string
	// The response the test 'external' cloud foundry server should send back.
	Response string
	// The code the test 'external' cloud foundry server should send back.
	ResponseCode int
}

// MockCompleteEnvVars is just a commonly used env vars object that contains non-empty values for all the fields of the EnvVars struct.
var MockCompleteEnvVars = helpers.EnvVars{
	ClientID:     "ID",
	ClientSecret: "Secret",
	Hostname:     "https://hostname",
	LoginURL:     "https://loginurl",
	UAAURL:       "https://uaaurl",
	APIURL:       "https://apiurl",
	LogURL:       "https://logurl",
	PProfEnabled: "true",
	SessionKey:   "lalala",
	BasePath:     os.Getenv(helpers.BasePathEnvVar),
}

// CreateExternalServer creates a test server that should reply with the given parameters assuming that the incoming request matches what we want.
func CreateExternalServer(t *testing.T, test *BasicProxyTest) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.RequestURI() != test.ExpectedPath {
			t.Errorf("Server expected path %s but instead received path %s\n", test.ExpectedPath, r.URL.Path)
		} else if r.Method != test.RequestMethod {
			t.Errorf("Server expected method %s but instead received method %s\n", test.RequestMethod, r.Method)
		} else {
			w.WriteHeader(test.ResponseCode)
			fmt.Fprintln(w, test.Response)
		}
		headerAuth := r.Header.Get("Authorization")
		oauthToken, ok := test.SessionData["token"].(oauth2.Token)
		if ok {
			if headerAuth != "Bearer "+oauthToken.AccessToken {
				t.Errorf("Unexpected authorization header, (%v) is found. Expected %s", headerAuth, oauthToken.AccessToken)
			}
		} else {
			t.Errorf("Error converting to Session data to oauth.Token struct")
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
		env, _ := cfenv.Current()
		mockSettings.InitSettings(test.EnvVars, env)
		mockSettings.TokenContext = context.TODO()
		c.Settings = mockSettings

		response, request := NewTestRequest(test.RequestMethod, fullURL, test.RequestBody)
		request.URL.Scheme = "http"
		request.URL.Host = request.Host
		test.EnvVars.APIURL = testServer.URL
		test.EnvVars.UAAURL = testServer.URL
		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		return response, request, router
	}
	t.Errorf("Cannot get token data")
	return nil, nil, nil
}

// VerifyExternalCallResponse will verify the test response with what was expected by the test.
func VerifyExternalCallResponse(t *testing.T, response *httptest.ResponseRecorder, test *BasicProxyTest) {
	// Check response.
	if strings.TrimSpace(response.Body.String()) != test.ExpectedResponse {
		t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.TestName, test.ExpectedResponse, response.Body.String())
	}
	if response.Code != test.ExpectedCode {
		t.Errorf("Test %s did not meet expected code. Expected %d. Found %d.\n", test.TestName, test.ExpectedCode, response.Code)
	}
}
