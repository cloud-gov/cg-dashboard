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
		Handlers: []Handler{
			{
				RequestMethod: "GET",
				ExpectedPath:  "/userinfo",
				Response:      "test",
				ResponseCode:  http.StatusOK,
			},
		},
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
				TestName:    "UAA Invite User no body",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"failure\", \"data\": \"no body in request.\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "UAA Invite User with e-mail in body but missing invite url",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"failure\", \"data\": \"Missing correct params.\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users",
				Response:      "{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"user-guid\"}]}",
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "POST",
				ExpectedPath:  "/v2/users",
				ResponseCode:  http.StatusCreated,
			},
		},
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "UAA Invite User with e-mail in body but missing invite url",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"failure\", \"data\": \"Missing correct params.\"}",
			ExpectedCode:     http.StatusBadRequest,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users",
				Response:      "{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"user-guid\"}]}",
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "POST",
				ExpectedPath:  "/v2/users",
				ResponseCode:  http.StatusCreated,
			},
		},
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "UAA Invite User with e-mail in body",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "{\"status\": \"success\", \"userGuid\": \"user-guid\"}",
			ExpectedCode:     http.StatusOK,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users",
				Response:      "{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"user-guid\", \"inviteLink\": \"http://some.link\"}]}",
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "POST",
				ExpectedPath:  "/v2/users",
				ResponseCode:  http.StatusCreated,
			},
		},
	},
}

func TestInviteUsers(t *testing.T) {
	for _, test := range inviteUsersTest {
		// Create the external server that the proxy will send the request to.
		testServer := CreateExternalServerForPrivileged(t, test)
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
			ExpectedResponse: fmt.Sprintf(`{"status": "Bad request", "error_description": "Missing valid guid."}`),
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   "/uaa/uaainfo",
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
		Handlers: []Handler{
			{
				RequestMethod: "GET",
				Response:      "success",
				ExpectedPath:  "/Users/test",
				ResponseCode:  http.StatusOK,
			},
		},
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
