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
		ExpectedResponse: NewJSONResponseContentTester("{\"status\": \"authorized\"}"),
	},
}

func TestAuthStatus(t *testing.T) {
	for _, test := range authStatusTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/authstatus", nil)

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if !test.ExpectedResponse.Check(t, response.Body.String()) {
			t.Errorf("Expected %s. Found %s\n", test.ExpectedResponse.Display(), response.Body.String())
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
		ExpectedResponse: NewStringContentTester("https://loginurl/profile"),
	},
}

func TestProfile(t *testing.T) {
	for _, test := range profileTests {
		// Create request
		response, request := NewTestRequest("GET", "/v2/profile", nil)

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if !test.ExpectedResponse.Check(t, response.Header().Get("location")) {
			t.Errorf("Profile route does not redirect to loginurl profile page")
		}
	}
}
