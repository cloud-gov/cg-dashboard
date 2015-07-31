package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	. "github.com/18F/cf-deck/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"

	"fmt"
	"strings"
	"testing"
)

type basicAPITest struct {
	BasicConsoleUnitTest
	expectedResponse string
}

var oauthTests = []basicAPITest{
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
		apiRouter := router.Subrouter(controllers.APIContext{}, "/v2")
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

var authStatusTests = []basicAPITest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Status Session",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		expectedResponse: "{\"status\": \"authorized\"}",
	},
}

func TestAuthStatus(t *testing.T) {
	for _, test := range authStatusTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/authstatus")

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Body.String() != test.expectedResponse {
			t.Errorf("Expected %s. Found %s\n", test.expectedResponse, response.Body.String())
		}
	}
}

var profileTests = []basicAPITest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		expectedResponse: "/v2/loginurl/profile",
	},
}

func TestProfile(t *testing.T) {
	for _, test := range profileTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/profile")

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Header().Get("location") != test.expectedResponse {
			t.Errorf("Profile route does not redirect to loginurl profile page")
		}
	}
}

var logoutTests = []basicAPITest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile To Logout",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		expectedResponse: "/v2/loginurl/logout.do",
	},
}

func TestLogout(t *testing.T) {
	for _, test := range logoutTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/logout")

		router, store := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Header().Get("location") != test.expectedResponse {
			t.Errorf("Logout route does not redirect to logout page")
		}
		if store.Session.Options.MaxAge != -1 {
			t.Errorf("Logout does not change MaxAge to -1")
		}
		if store.Session.Values["token"] != nil {
			t.Errorf("Logout does not clear the token stored in the session")
		}
	}
}
