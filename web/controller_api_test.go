package main

import (
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
		t.Run(test.TestName, func(t *testing.T) {
			// Create request
			response, request := NewTestRequest("GET", "/v2/authstatus", nil)

			router, _, _ := CreateRouterWithMockSession(t, test.SessionData, test.EnvVars, "")
			router.ServeHTTP(response, request)
			if !test.ExpectedResponse.Check(t, response.Body.String()) {
				t.Errorf("Expected %s. Found %s\n", test.ExpectedResponse.Display(), response.Body.String())
			}
		})
	}
}
