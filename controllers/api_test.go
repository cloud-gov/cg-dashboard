package controllers

import (
	"github.com/18F/cf-console/helpers"
	"github.com/18F/cf-console/helpers/testhelpers"
	"github.com/gocraft/web"

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
	for _, test := range oauthTests {
		// Initialize a new session store.
		store := testhelpers.MockSessionStore{}
		store.ResetSessionData(test.sessionData)
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
