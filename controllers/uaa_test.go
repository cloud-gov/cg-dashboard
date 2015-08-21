package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	. "github.com/18F/cf-deck/helpers/testhelpers"

	"fmt"
	"net/http"
	"testing"
)

var userinfoTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic User Info",
				SessionData: ValidTokenData,
			},
			ExpectedResponse: "test",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   "/uaa/userinfo",
		ExpectedPath:  "/userinfo",
		Response:      "test",
		ResponseCode:  http.StatusOK,
	},
}

func TestUserinfo(t *testing.T) {
	for _, test := range userinfoTests {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, &test)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.RequestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, test.SessionData, c.SecureContext, MockCompleteEnvVars, testServer, fullURL, test.RequestMethod)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}

/*
var queryUsersTests = []BasicProxyTest{
	{
		basicSecureTest: basicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Query Users",
				SessionData: ValidTokenData,
			},
			expectedResponse: "test",
			expectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		requestMethod: "POST",
		requestPath:   "/uaa/Users",
		response:      "test",
		responseCode:  http.StatusOK,
	},
}

func TestQueryUsers(t *testing.T) {
	for _, test := range queryUsersTests {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, test.requestPath, test.requestMethod, test.responseCode, test.response, test.SessionData)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.requestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, test.SessionData, c.SecureContext, MockCompleteEnvVars, testServer, fullURL, test.requestMethod)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, test.expectedResponse, test.expectedCode, test.TestName)
		testServer.Close()
	}
}
*/
/*
var auth2StatusTests = []basicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Status Session",
			EnvVars:     MockCompleteEnvVars,
			SessionData: ValidTokenData,
		},
		expectedResponse: "{\"status\": \"authorized\"}",
	},
}

func Test2AuthStatus(t *testing.T) {
	for _, test := range auth2StatusTests {
		// Create request
		response, request := NewTestRequest("GET", "/uaa/userinfo")

		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		if response.Body.String() != test.expectedResponse {
			t.Errorf("Expected %s. Found %s\n", test.expectedResponse, response.Body.String())
		}
	}
}
*/
