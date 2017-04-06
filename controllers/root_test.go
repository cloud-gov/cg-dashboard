package controllers_test

import (
	"strings"
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/controllers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
)

func TestPing(t *testing.T) {
	response, request := NewTestRequest("GET", "/ping", nil)
	env, _ := cfenv.Current()
	router, _, _ := controllers.InitApp(MockCompleteEnvVars, env)
	router.ServeHTTP(response, request)
	if response.Body.String() != "{\"status\": \"alive\", \"build-info\": \"developer-build\"}" {
		t.Errorf("Expected alive. Found %s\n", response.Body.String())
	}
}

var loginHandshakeTests = []BasicConsoleUnitTest{
	{
		TestName:    "Login Handshake With Already Authenticated User",
		EnvVars:     MockCompleteEnvVars,
		Code:        302,
		Location:    "https://hostname/#/dashboard",
		SessionData: ValidTokenData,
	},
	{
		TestName: "Login Handshake With Non Authenticated User",
		EnvVars:  MockCompleteEnvVars,
		Code:     302,
		Location: "https://loginurl/oauth/authorize",
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

var logoutTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile To Logout",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "https://loginurl/logout.do",
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName: "Basic Unauthorized Profile To Logout",
			EnvVars:  MockCompleteEnvVars,
		},
		ExpectedResponse: "https://loginurl/logout.do",
	},
}

func TestLogout(t *testing.T) {
	for _, test := range logoutTests {
		// Create request
		response, request := NewTestRequest("GET", "/logout", nil)

		router, store := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		location := response.Header().Get("location")
		if location != test.ExpectedResponse {
			t.Errorf("Logout route does not redirect to logout page (%s:%s)", location, test.ExpectedResponse)
		}
		if store.Session.Options.MaxAge != -1 {
			t.Errorf("Logout does not change MaxAge to -1")
		}
		if store.Session.Values["token"] != nil {
			t.Errorf("Logout does not clear the token stored in the session")
		}
	}
}
