package controllers

import (
	"github.com/18F/cf-console/helpers"
	"github.com/18F/cf-console/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"

	"fmt"
	"strings"
	"testing"
)

type oauthTestData struct {
	testName     string
	sessionData  map[string]interface{}
	expectedText string
}

var oauthTests = []oauthTestData{
	{
		testName:     "Basic Valid OAuth Session",
		sessionData:  testhelpers.ValidTokenData,
		expectedText: "test",
	},
	{
		testName:     "Basic Invalid OAuth Session",
		sessionData:  testhelpers.InvalidTokenData,
		expectedText: "{\"status\": \"unauthorized\"}",
	},
}

func (c *APIContext) Test(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "test")
}

func TestOAuth(t *testing.T) {
	mockSettings := helpers.Settings{}
	mockSettings.TokenContext = context.TODO()

	for _, test := range oauthTests {
		// Initialize a new session store.
		store := testhelpers.MockSessionStore{}
		store.ResetSessionData(test.sessionData, "")
		mockSettings.Sessions = store

		// Setup a test route on the API router (which is guarded by OAuth)
		response, request := testhelpers.NewTestRequest("GET", "/v2/test")
		router := InitRouter(&mockSettings)
		apiRouter := router.Subrouter(APIContext{}, "/v2")
		apiRouter.Middleware((*APIContext).OAuth)
		apiRouter.Get("/test", (*APIContext).Test)

		// Make the request and check.
		router.ServeHTTP(response, request)
		if strings.TrimSpace(response.Body.String()) != test.expectedText {
			t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.testName, test.expectedText, response.Body.String())
		}
	}
}

type authStatusTest struct {
	testName    string
	envVars     helpers.EnvVars
	sessionData map[string]interface{}
	returnValue string
}

var authStatusTests = []authStatusTest{
	{
		testName: "Basic Valid Settings",
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

func TestAuthStatus(t *testing.T) {
	for _, test := range authStatusTests {
		// Create request
		response, request := testhelpers.NewTestRequest("GET", "/v2/authstatus")

		// Initialize settings.
		settings := helpers.Settings{}
		settings.InitSettings(test.envVars)

		// Initialize a new session store.
		store := testhelpers.MockSessionStore{}
		store.ResetSessionData(test.sessionData, "")

		// Override the session store.
		settings.Sessions = store

		// Create the router.
		router := InitRouter(&settings)

		router.ServeHTTP(response, request)
		if response.Body.String() != test.returnValue {
			t.Errorf("Expected %s. Found %s\n", test.returnValue, response.Body.String())
		}
	}
}
