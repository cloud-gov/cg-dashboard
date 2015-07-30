package controllers_test

import (
	"github.com/18F/cf-console/controllers"
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
		router := controllers.InitRouter(&mockSettings)
		apiRouter := router.Subrouter(controllers.APIContext{}, "/v2")
		apiRouter.Middleware((*controllers.APIContext).OAuth)
		apiRouter.Get("/test", func(c *controllers.APIContext, rw web.ResponseWriter, r *web.Request) {
			fmt.Fprintf(rw, "test")
		})

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

		router := testhelpers.CreateRouterWithMockSession(test.sessionData, test.envVars)
		router.ServeHTTP(response, request)
		if response.Body.String() != test.returnValue {
			t.Errorf("Expected %s. Found %s\n", test.returnValue, response.Body.String())
		}
	}
}

var profileTests = []authStatusTest{
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
		returnValue: "/v2/loginurl/profile",
	},
}

func TestProfile(t *testing.T) {
	for _, test := range profileTests {
		// Create request
		response, request := testhelpers.NewTestRequest("GET", "/v2/profile")

		router := testhelpers.CreateRouterWithMockSession(test.sessionData, test.envVars)
		router.ServeHTTP(response, request)
		if response.Header().Get("location") != test.returnValue {
			t.Errorf("Profile route does not redirect to loginurl profile page")
		}
	}
}
