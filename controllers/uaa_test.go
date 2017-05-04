package controllers_test

import (
	"github.com/18F/cg-dashboard/controllers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"

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
				EnvVars:     GetMockCompleteEnvVars(),
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
		response, request, router := PrepareExternalServerCall(t, c.SecureContext, testServer, fullURL, test)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}

var inviteUsersTest = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "UAA Invite User",
				SessionData: ValidTokenData,
				EnvVars:     MockCompleteEnvVars,
			},
			ExpectedResponse: "test",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite_users",
		ExpectedPath:  "/invite_users",
		Response:      "test",
		ResponseCode:  http.StatusOK,
	},
}

func TestInviteUsers(t *testing.T) {
	for _, test := range inviteUsersTest {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, &test)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.RequestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, c.SecureContext, testServer, fullURL, test)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}

var inviteUsersTestRedirect = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "UAA Invite User",
				SessionData: ValidTokenData,
				EnvVars:     MockCompleteEnvVars,
			},
			ExpectedResponse: "test",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite_users?redirect_uri=http://localhost:9999/uaa/userinfo",
		ExpectedPath:  "/invite_users?redirect_uri=http://localhost:9999/uaa/userinfo",
		Response:      "test",
		ResponseCode:  http.StatusOK,
	},
}

func TestInviteUsersRedirect(t *testing.T) {
	for _, test := range inviteUsersTestRedirect {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, &test)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.RequestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, c.SecureContext, testServer, fullURL, test)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}

var uaainfoTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Uaa Info without guid",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"Bad request\", \"error_description\": \"Missing valid guid.\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   "/uaa/uaainfo",
		ExpectedPath:  "/uaainfo",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Uaa Info with guid",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "success",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   "/uaa/uaainfo?uaa_guid=test",
		Response:      "success",
		ExpectedPath:  "/Users/test",
		ResponseCode:  http.StatusOK,
	},
}

func TestUaainfo(t *testing.T) {
	for _, test := range uaainfoTests {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServer(t, &test)
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testServer.URL, test.RequestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, c.SecureContext, testServer, fullURL, test)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testServer.Close()
	}
}

var queryUsersTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Query Users Empty Body",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"error\", \"message\": \"empty request body\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/Users",
		ExpectedPath:  "/Users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Query Users Bad Filters",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"error\", \"message\": \"not enough filters\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/Users",
		RequestBody:   []byte(string("hello")),
		ExpectedPath:  "/Users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Query Users",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "hello",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/Users",
		RequestBody:   []byte(string("{\"filter1\": \"value1\"}")),
		ExpectedPath:  "/Users",
		Response:      "hello",
		ResponseCode:  http.StatusOK,
	},
}
