package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	. "github.com/18F/cf-deck/helpers/testhelpers"

	"strings"
	"testing"
)

func TestPing(t *testing.T) {
	response, request := NewTestRequest("GET", "/ping", nil)
	router := controllers.InitRouter(nil)
	router.ServeHTTP(response, request)
	if response.Body.String() != "{\"status\": \"alive\"}" {
		t.Errorf("Expected alive. Found %s\n", response.Body.String())
	}
}

var loginHandshakeTests = []BasicConsoleUnitTest{
	{
		TestName:    "Login Handshake With Already Authenticated User",
		EnvVars:     MockCompleteEnvVars,
		Code:        302,
		Location:    "/#/dashboard",
		SessionData: ValidTokenData,
	},
	{
		TestName: "Login Handshake With Non Authenticated User",
		EnvVars:  MockCompleteEnvVars,
		Code:     302,
		Location: "/oauth/authorize",
	},
}

func TestLoginHandshake(t *testing.T) {
	response, request := NewTestRequest("GET", "/handshake", nil)
	for _, test := range loginHandshakeTests {
		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		// Check the return code.
		if response.Code != test.Code {
			t.Errorf("Expected http code %d, Found http code %d\n", test.Code, response.Code)
		}
		// Check the location of where we relocated to.
		if !strings.Contains(response.Header().Get("Location"), test.Location) {
			t.Errorf("Expected http location %s, Found http code %s\n", test.Location, response.Header().Get("Location"))
		}
	}

}
