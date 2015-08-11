package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	. "github.com/18F/cf-deck/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type basicSecureTest struct {
	BasicConsoleUnitTest
	expectedCode     int
	expectedResponse string
}

var oauthTests = []basicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Valid OAuth Session",
			SessionData: ValidTokenData,
		},
		expectedResponse: "test",
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Invalid OAuth Session",
			SessionData: InvalidTokenData,
		},
		expectedResponse: "{\"status\": \"unauthorized\"}",
	},
}

func TestOAuth(t *testing.T) {
	mockSettings := helpers.Settings{}
	mockSettings.TokenContext = context.TODO()

	for _, test := range oauthTests {
		// Initialize a new session store.
		store := MockSessionStore{}
		store.ResetSessionData(test.SessionData, "")
		mockSettings.Sessions = store

		// Setup a test route on the API router (which is guarded by OAuth)
		response, request := NewTestRequest("GET", "/v2/test")
		router := controllers.InitRouter(&mockSettings)
		secureRouter := router.Subrouter(controllers.SecureContext{}, "/")
		apiRouter := secureRouter.Subrouter(controllers.APIContext{}, "/v2")
		apiRouter.Middleware((*controllers.APIContext).OAuth)
		apiRouter.Get("/test", func(c *controllers.APIContext, rw web.ResponseWriter, r *web.Request) {
			fmt.Fprintf(rw, "test")
		})

		// Make the request and check.
		router.ServeHTTP(response, request)
		if strings.TrimSpace(response.Body.String()) != test.expectedResponse {
			t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.TestName, test.expectedResponse, response.Body.String())
		}
	}
}

type basicProxyTest struct {
	basicSecureTest
	requestMethod string
	requestPath   string
	response      string
	responseCode  int
}

var proxyTests = []basicProxyTest{
	{
		basicSecureTest: basicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Ok Proxy call",
				SessionData: ValidTokenData,
			},
			expectedResponse: "test",
			expectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		requestMethod: "GET",
		requestPath:   "/test",
		response:      "test",
		responseCode:  http.StatusOK,
	},
}

func TestProxy(t *testing.T) {
	for _, test := range proxyTests {
		// Create the external server that the proxy will send the request to.
		testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path != test.requestPath {
				t.Errorf("Server expected path %s but instead received path %s\n", test.requestPath, r.URL.Path)
			} else if r.Method != test.requestMethod {
				t.Errorf("Server expected method %s but instead received method %s\n", test.requestMethod, r.Method)
			} else {
				w.WriteHeader(test.responseCode)
				fmt.Fprintln(w, test.response)
			}
		}))

		// Make sure the context has the token.
		if token, ok := test.SessionData["token"].(oauth2.Token); ok {
			// Assign token
			c := &controllers.SecureContext{Context: new(controllers.Context)}
			c.Token = token

			// Assign settings to context
			mockSettings := &helpers.Settings{}
			mockSettings.InitSettings(MockCompleteEnvVars)
			mockSettings.TokenContext = context.TODO()
			c.Settings = mockSettings

			// Construct full url for the proxy.
			fullURL := fmt.Sprintf("%s%s", testServer.URL, test.requestPath)
			response, request := NewTestRequest(test.requestMethod, fullURL)
			request.URL.Scheme = "http"
			request.URL.Host = request.Host
			// Call the proxy function.
			c.Proxy(response, request, fullURL)
			// Check response.
			if strings.TrimSpace(response.Body.String()) != test.expectedResponse {
				t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.TestName, test.expectedResponse, response.Body.String())
			}
			if response.Code != test.expectedCode {
				t.Errorf("Test %s did not meet expected code. Expected %d. Found %d.\n", test.TestName, test.expectedCode, response.Code)
			}
		} else {
			t.Errorf("Cannot get token data")
		}
		testServer.Close()
	}
}
