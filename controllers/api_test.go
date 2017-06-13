package controllers_test

import (
	. "github.com/18F/cg-dashboard/helpers/testhelpers"

	"testing"
)

var authStatusTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Status Session",
			EnvVars:     GetMockCompleteEnvVars(),
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
			EnvVars:     GetMockCompleteEnvVars(),
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "https://loginurl/profile",
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
