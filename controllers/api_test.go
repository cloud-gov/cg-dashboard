package controllers_test

import (
	. "github.com/18F/cf-deck/helpers/testhelpers"

	"testing"
)

var authStatusTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Status Session",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "{\"status\": \"authorized\"}",
	},
}

func TestAuthStatus(t *testing.T) {
	for _, test := range authStatusTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/authstatus", nil)

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Body.String() != test.ExpectedResponse {
			t.Errorf("Expected %s. Found %s\n", test.ExpectedResponse, response.Body.String())
		}
	}
}

var profileTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "/v2/loginurl/profile",
	},
}

func TestProfile(t *testing.T) {
	for _, test := range profileTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/profile", nil)

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Header().Get("location") != test.ExpectedResponse {
			t.Errorf("Profile route does not redirect to loginurl profile page")
		}
	}
}

var logoutTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile To Logout",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "/v2/loginurl/logout.do",
	},
}

func TestLogout(t *testing.T) {
	for _, test := range logoutTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/logout", nil)

		router, store := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Header().Get("location") != test.ExpectedResponse {
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
