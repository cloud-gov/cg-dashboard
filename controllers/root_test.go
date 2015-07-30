package controllers_test

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"
	"github.com/18F/cf-console/helpers/testhelpers"

	"strings"
	"testing"
)

func TestPing(t *testing.T) {
	response, request := testhelpers.NewTestRequest("GET", "/ping")
	router := controllers.InitRouter(nil)
	router.ServeHTTP(response, request)
	if response.Body.String() != "{\"status\": \"alive\"}" {
		t.Errorf("Expected alive. Found %s\n", response.Body.String())
	}
}

type loginHandshakeTest struct {
	testName       string
	envVars        helpers.EnvVars
	sessionData    map[string]interface{}
	returnCode     int
	returnLocation string
}

var loginHandshakeTests = []loginHandshakeTest{
	{
		testName: "Login Handshake With Already Authenticated User",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		sessionData:    testhelpers.ValidTokenData,
		returnCode:     302,
		returnLocation: "/#/dashboard",
	},
	{
		testName: "Login Handshake With Already Authenticated User",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		returnCode:     302,
		returnLocation: "/oauth/authorize",
	},
}

func TestLoginHandshake(t *testing.T) {
	response, request := testhelpers.NewTestRequest("GET", "/handshake")
	for _, test := range loginHandshakeTests {
		router, _ := testhelpers.CreateRouterWithMockSession(test.sessionData, test.envVars)
		router.ServeHTTP(response, request)
		// Check the return code.
		if response.Code != test.returnCode {
			t.Errorf("Expected http code %d, Found http code %d\n", test.returnCode, response.Code)
		}
		// Check the location of where we relocated to.
		if !strings.Contains(response.Header().Get("Location"), test.returnLocation) {
			t.Errorf("Expected http location %s, Found http code %s\n", test.returnLocation, response.Header().Get("Location"))
		}
	}

}
