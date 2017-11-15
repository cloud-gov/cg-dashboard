package controllers_test

import (
	"strings"
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/govau/cf-common/env"

	"github.com/18F/cg-dashboard/controllers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
)

func TestPing(t *testing.T) {
	response, request := NewTestRequest("GET", "/ping", nil)
	app, _ := cfenv.Current()
	router, _, err := controllers.InitApp(
		env.NewVarSet(env.WithMapLookup(GetMockCompleteEnvVars())),
		app,
	)
	if err != nil {
		t.Fatal(err)
	}
	router.ServeHTTP(response, request)
	expectedResponse := `{"status":"alive","build-info":"developer-build","session-store-health":{"store-type":"cookiestore","store-up":true}}`
	if response.Body.String() != expectedResponse {
		t.Errorf("Expected %s. Found %s\n", expectedResponse, response.Body.String())
	}
	if response.Code != 200 {
		t.Errorf("Expected code %d. Found %d", 200, response.Code)
	}
}

var loginHandshakeTests = []BasicConsoleUnitTest{
	{
		TestName:    "Login Handshake With Already Authenticated User",
		EnvVars:     GetMockCompleteEnvVars(),
		Code:        302,
		Location:    "https://hostname/#/dashboard",
		SessionData: ValidTokenData,
	},
	{
		TestName: "Login Handshake With Non Authenticated User",
		EnvVars:  GetMockCompleteEnvVars(),
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
			EnvVars:     GetMockCompleteEnvVars(),
			SessionData: ValidTokenData,
		},
		ExpectedResponse: NewStringContentTester("https://loginurl/logout.do"),
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName: "Basic Unauthorized Profile To Logout",
			EnvVars:  GetMockCompleteEnvVars(),
		},
		ExpectedResponse: NewStringContentTester("https://loginurl/logout.do"),
	},
}

func TestLogout(t *testing.T) {
	for _, test := range logoutTests {
		// Create request
		response, request := NewTestRequest("GET", "/logout", nil)

		router, store := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		location := response.Header().Get("location")
		if !test.ExpectedResponse.Check(t, location) {
			t.Errorf("Logout route does not redirect to logout page (%s:%s)", location, test.ExpectedResponse.Display())
		}
		if store.Session.Options.MaxAge != -1 {
			t.Errorf("Logout does not change MaxAge to -1")
		}
		if store.Session.Values["token"] != nil {
			t.Errorf("Logout does not clear the token stored in the session")
		}
	}
}
