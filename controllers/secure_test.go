package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	. "github.com/18F/cf-deck/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"

	"fmt"
	"io/ioutil"
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

type BasicProxyTest struct {
	basicSecureTest
	requestMethod string
	requestPath   string
	response      string
	responseCode  int
}

var proxyTests = []BasicProxyTest{
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
		testServer := CreateExternalServer(t, test.requestPath, test.requestMethod, test.responseCode, test.response, test.SessionData)

		ExecuteExternalServerCall(t, test.SessionData, testServer, test.requestPath, test.requestMethod, test.expectedResponse, test.expectedCode, test.TestName, MockCompleteEnvVars, false)

		testServer.Close()
	}
}

func TestPrivilegedProxy(t *testing.T) {
	for _, test := range proxyTests {
		privilegedToken := "90d64460d14870c08c81352a05dedd3465940a7c"
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
			// Check that we are using the privileged token
			// This line here is why we can't use the generic CreateExternalServer.
			// Could add a token parameter. TODO
			headerAuth := r.Header.Get("Authorization")
			if headerAuth == "Basic "+privilegedToken {
				t.Errorf("Unexpected authorization header, %v is found.", headerAuth)
			}
		}))
		// Create the external server that will act as the UAA server to get the privileged token from.
		testUAAServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.String() != "/oauth/token" {
				t.Errorf("authenticate client request URL = %q; want %q", r.URL, "/token")
			}

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
			if string(body) != "client_id="+MockCompleteEnvVars.ClientID+"&grant_type=client_credentials&scope=scim.read" {
				t.Errorf("payload = %q; want %q", string(body), "client_id="+MockCompleteEnvVars.ClientID+"&grant_type=client_credentials&scope=scim.read")
			}
			w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
			// Write the privileged token so that it can be used.
			w.Write([]byte("access_token=" + privilegedToken + "&token_type=bearer"))
		}))
		// Create a copy and modify the env vars to point the token bearing server to our UAA server.
		CopyOfCompleteEnvVars := MockCompleteEnvVars
		CopyOfCompleteEnvVars.UAAURL = testUAAServer.URL
		ExecuteExternalServerCall(t, test.SessionData, testServer, test.requestPath, test.requestMethod, test.expectedResponse, test.expectedCode, test.TestName, CopyOfCompleteEnvVars, true)

		testUAAServer.Close()
		testServer.Close()
	}
}
