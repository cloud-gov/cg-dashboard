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
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: "test",
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		ExpectedPath:  "/invite_users",
		Response:      "test",
		ResponseCode:  http.StatusOK,
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
			ExpectedResponse: fmt.Sprintf(`"{"status": "error", "message": "empty request body"}`),
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
			ExpectedResponse: fmt.Sprintf(`{"status": "error", "message": "not enough filters"}`),
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
		RequestBody:   []byte(`{"filter1": "value1"}`),
		ExpectedPath:  "/Users",
		Response:      "hello",
		ResponseCode:  http.StatusOK,
	},
}

var emailInvitedUsersTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Missing email parameter",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: fmt.Sprintf(`{"status": "failure", "data": "Missing correct params."}`),
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/email",
		RequestBody:   []byte(`{}`),
		ExpectedPath:  "/Users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Missing inviteUrl parameter",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: fmt.Sprintf(`{"status": "failure", "data": "Missing correct params."}`),
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/email",
		RequestBody:   []byte(`{"email": "test@test.com"}`),
		ExpectedPath:  "/Users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Missing inviteUrl parameter",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: fmt.Sprintf(`{"status": "failure", "data": "Missing correct params."}`),
			ExpectedCode:     http.StatusBadRequest,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/email",
		RequestBody:   []byte(`{"inviteUrl": "http://localhost:9999/invitehere?123"}`),
		ExpectedPath:  "/Users",
	},
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Working request example where email and inviteUrl are in json request",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: fmt.Sprintf("{\"status\": \"success\", \"email\": \"name@domain.com\", \"invite\": \"http://localhost:9999/invitehere?123\" }"),
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/email",
		RequestBody:   []byte("{\"email\": \"name@domain.com\", \"inviteUrl\": \"http://localhost:9999/invitehere?123\"}"),
		ExpectedPath:  "/Users",
	},
}

func TestSendInvite(t *testing.T) {
	for _, test := range emailInvitedUsersTests {
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
