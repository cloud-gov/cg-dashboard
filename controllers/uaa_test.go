package controllers_test

import (
	"strings"

	"github.com/18F/cg-dashboard/controllers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"

	"fmt"
	"net/http"
	"testing"
)

const (
	testUserGUID = "3CE6B080-2C27-4ADF-B73E-ED93E6478CFE"
)

var userinfoTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic User Info",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: NewStringContentTester("test"),
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
			ExpectedResponse: NewJSONResponseContentTester("{\"status\": \"failure\", \"data\": \"no body in request.\"}"),
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
			ExpectedResponse: NewJSONResponseContentTester("{\"status\": \"failure\", \"data\": \"Missing correct params.\"}"),
			ExpectedCode:     http.StatusBadRequest,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users?redirect_uri=https%3A%2F%2Fhostname",
				Response:      fmt.Sprintf("{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"%s\"}]}", testUserGUID),
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "GET",
				ExpectedPath:  "/Users?filter=email+eq+%22test%40example.com%22",
				ResponseCode:  http.StatusOK,
				Response:      fmt.Sprintf("{\"resources\": [{\"active\": true, \"verified\": false, \"id\": \"%s\", \"externalId\": \"user-guid@domain.com\" }]}", testUserGUID),
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
				TestName:    "UAA Invite User with e-mail in body but missing e-mail",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: NewJSONResponseContentTester("{\"status\": \"failure\", \"data\": \"Missing correct params.\"}"),
			ExpectedCode:     http.StatusBadRequest,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users?redirect_uri=https%3A%2F%2Fhostname",
				Response:      fmt.Sprintf("{\"new_invites\": [{\"inviteLink\": \"http://some.link\", \"userId\": \"%s\"}]}", testUserGUID),
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "GET",
				ExpectedPath:  "/Users?filter=email+eq+%22test%40example.com%22",
				ResponseCode:  http.StatusOK,
				Response:      fmt.Sprintf("{\"resources\": [{\"active\": true, \"verified\": false, \"id\": \"%s\", \"externalId\": \"user-guid@domain.com\" }]}", testUserGUID),
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
				TestName:    "UAA Invite User with e-mail in body (new user)",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: NewJSONResponseContentTester(fmt.Sprintf("{\"status\": \"success\", \"userGuid\": \"%s\", \"verified\": false}", testUserGUID)),
			ExpectedCode:     http.StatusOK,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users?redirect_uri=https%3A%2F%2Fhostname",
				Response:      fmt.Sprintf("{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"%s\", \"inviteLink\": \"http://some.link\"}]}", testUserGUID),
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "GET",
				ExpectedPath:  "/Users?filter=email+eq+%22test%40example.com%22",
				ResponseCode:  http.StatusOK,
				Response:      "{\"resources\": []}",
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
				TestName:    "UAA Invite User with already verified user",
				SessionData: ValidTokenData,
				EnvVars:     GetMockCompleteEnvVars(),
			},
			ExpectedResponse: NewJSONResponseContentTester(fmt.Sprintf("{\"status\": \"success\", \"userGuid\": \"%s\", \"verified\": true}", testUserGUID)),
			ExpectedCode:     http.StatusOK,
		},
		RequestMethod: "POST",
		RequestPath:   "/uaa/invite/users",
		RequestBody:   []byte("{\"email\": \"test@example.com\"}"),
		Handlers: []Handler{
			{
				RequestMethod: "POST",
				ExpectedPath:  "/invite_users?redirect_uri=https%3A%2F%2Fhostname",
				Response:      fmt.Sprintf("{\"new_invites\": [{\"email\": \"test@example.com\", \"userId\": \"%s\", \"inviteLink\": \"http://some.link\"}]}", testUserGUID),
				ResponseCode:  http.StatusOK,
			},
			{
				RequestMethod: "GET",
				ExpectedPath:  "/Users?filter=email+eq+%22test%40example.com%22",
				ResponseCode:  http.StatusOK,
				Response:      fmt.Sprintf("{\"resources\": [{\"active\": true, \"verified\": true, \"id\": \"%s\", \"externalId\": \"user-guid@domain.com\" }]}", testUserGUID),
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
			ExpectedResponse: NewJSONResponseContentTester(fmt.Sprintf(`{"status": "Bad request", "error_description": "Missing valid guid."}`)),
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
			ExpectedResponse: NewStringContentTester("success"),
			ExpectedCode:     http.StatusOK,
		},
		// What the "external" server will send back to the proxy.
		RequestMethod: "GET",
		RequestPath:   fmt.Sprintf("/uaa/uaainfo?uaa_guid=%s", testUserGUID),
		Handlers: []Handler{
			{
				RequestMethod: "GET",
				Response:      "success",
				ExpectedPath:  fmt.Sprintf("/Users/%s", strings.ToLower(testUserGUID)), // our server will canonicalize the guid
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
