package controllers_test

import (
	"github.com/18F/cg-deck/controllers"
	"github.com/18F/cg-deck/helpers"
	. "github.com/18F/cg-deck/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"

	"fmt"
	"net/http"
	"strings"
	"testing"
)

var oauthTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Valid OAuth Session",
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "test",
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Invalid OAuth Session",
			SessionData: InvalidTokenData,
		},
		ExpectedResponse: "{\"status\": \"unauthorized\"}",
	},
}

func TestOAuth(t *testing.T) {
	mockSettings := helpers.Settings{}
	mockSettings.TokenContext = context.TODO()

	for _, test := range oauthTests {
		// Initialize a new session store.
		store := MockSessionStore{}
		store.ResetSessionData(test.SessionData, "")
		mockSettings.Sessions = store

		// Setup a test route on the API router (which is guarded by OAuth)
		response, request := NewTestRequest("GET", "/v2/test", nil)
		router := controllers.InitRouter(&mockSettings)
		secureRouter := router.Subrouter(controllers.SecureContext{}, "/")
		apiRouter := secureRouter.Subrouter(controllers.APIContext{}, "/v2")
		apiRouter.Middleware((*controllers.APIContext).OAuth)
		apiRouter.Get("/test", func(c *controllers.APIContext, rw web.ResponseWriter, r *web.Request) {
			fmt.Fprintf(rw, "test")
		})

		// Make the request and check.
		router.ServeHTTP(response, request)
		if strings.TrimSpace(response.Body.String()) != test.ExpectedResponse {
			t.Errorf("Test %s did not meet expected value. Expected %s. Found %s.\n", test.TestName, test.ExpectedResponse, response.Body.String())
		}
	}
}

var proxyTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Ok Proxy call",
				SessionData: ValidTokenData,
				EnvVars:     MockCompleteEnvVars,
			},
			ExpectedResponse: "test",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   "/test",
		ExpectedPath:  "/test",
		Response:      "test",
		ResponseCode:  http.StatusOK,
	},
}

func TestProxy(t *testing.T) {
	for _, test := range proxyTests {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, &test)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.RequestPath)
		c := &controllers.SecureContext{Context: new(controllers.Context)}
		response, request, _ := PrepareExternalServerCall(t, c, testServer, fullURL, test)
		c.Proxy(response, request, fullURL, c.GenericResponseHandler)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}
