package controllers_test

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"
	"github.com/18F/cf-console/helpers/testhelpers"

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
	testName    string
	envVars     helpers.EnvVars
	sessionData map[string]interface{}
	returnValue string
}

var loginHandshakeTests = []loginHandshakeTest{
	{
		testName: "Login Handshake Tests",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		sessionData: testhelpers.ValidTokenData,
		returnValue: "{\"status\": \"authorized\"}",
	},
}

func TestLoginHandshake(t *testing.T) {
}
