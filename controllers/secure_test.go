package controllers_test

import (
	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/helpers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
	"github.com/gocraft/web"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	"fmt"
	"html/template"
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
		ExpectedCode:     200,
		ExpectedLocation: "",
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Invalid OAuth Session",
			SessionData: InvalidTokenData,
		},
		ExpectedResponse: `<a href="http://loginURL.com/oauth/authorize?access_type=online&amp;client_id=ClientID&amp;redirect_uri=http%3A%2F%2Fhostname.com%2Foauth2callback&amp;response_type=code&amp;scope=openid&amp;state=state">Found</a>`,
		ExpectedCode:     302,
		ExpectedLocation: "http://loginURL.com/oauth/authorize?access_type=online&client_id=ClientID&redirect_uri=http%3A%2F%2Fhostname.com%2Foauth2callback&response_type=code&scope=openid&state=state",
	},
}

func TestOAuth(t *testing.T) {
	mockSettings := helpers.Settings{}
	mockSettings.TokenContext = context.TODO()
	mockSettings.OAuthConfig = &oauth2.Config{
		ClientID:     "ClientID",
		ClientSecret: "ClientSecret",
		RedirectURL:  "http://hostname.com/oauth2callback",
		Scopes:       []string{"openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "http://loginURL.com/oauth/authorize",
			TokenURL: "http://tokenURL.com/oauth/token",
		},
	}
	mockSettings.StateGenerator = func() (string, error) {
		return "state", nil
	}

	for _, test := range oauthTests {
		// Initialize a new session store.
		store := MockSessionStore{}
		store.ResetSessionData(test.SessionData, "")
		mockSettings.Sessions = store

		// Setup a test route on the API router (which is guarded by OAuth)
		response, request := NewTestRequest("GET", "/v2/test", nil)
		router := controllers.InitRouter(&mockSettings, &template.Template{})
		secureRouter := router.Subrouter(controllers.SecureContext{}, "/")
		apiRouter := secureRouter.Subrouter(controllers.APIContext{}, "/v2")
		apiRouter.Middleware((*controllers.APIContext).OAuth)
		apiRouter.Get("/test", func(c *controllers.APIContext, rw web.ResponseWriter, r *web.Request) {
			fmt.Fprintf(rw, "test")
		})

		// Make the request and check.
		router.ServeHTTP(response, request)
		if response.Header().Get("Location") != test.ExpectedLocation {
			t.Errorf("Test %s did not meet expected location header.\nExpected %s.\nFound %s.\n", test.TestName, test.ExpectedLocation, response.Header().Get("Location"))
		}
		if !strings.Contains(response.Body.String(), test.ExpectedResponse) {
			t.Errorf("Test %s did not contain expected value.\nExpected %s.\n Found (%s)\n.", test.TestName, test.ExpectedResponse, response.Body.String())
		}
		if response.Code != test.ExpectedCode {
			t.Errorf("Test %s did not meet expected code.\nExpected %d.\nFound %d.\n", test.TestName, test.ExpectedCode, response.Code)
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
