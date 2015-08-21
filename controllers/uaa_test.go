package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	. "github.com/18F/cf-deck/helpers/testhelpers"

	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

var userinfoTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic User Info",
				SessionData: ValidTokenData,
				EnvVars:     MockCompleteEnvVars,
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

var queryUsersTests = []BasicProxyTest{
	{
		BasicSecureTest: BasicSecureTest{
			BasicConsoleUnitTest: BasicConsoleUnitTest{
				TestName:    "Basic Query Users Empty Body",
				SessionData: ValidTokenData,
				EnvVars:     MockCompleteEnvVars,
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
				EnvVars:     MockCompleteEnvVars,
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
				EnvVars:     MockCompleteEnvVars,
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

func TestQueryUsers(t *testing.T) {
	for _, test := range queryUsersTests {
		privilegedToken := "90d64460d14870c08c81352a05dedd3465940a7c"
		// Create the external server that will act as the UAA server to get the privileged token from and the same UAA server to return the query.
		testUAAServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.String() == "/oauth/token" {

				if got, want := r.Header.Get("Content-Type"), "application/x-www-form-urlencoded"; got != want {
					t.Errorf("Content-Type header = %q; want %q", got, want)
				}
				body, err := ioutil.ReadAll(r.Body)
				if err != nil {
					r.Body.Close()
				}
				if err != nil {
					t.Errorf("failed reading request body: %s.", err)
				}
				if string(body) != "client_id="+MockCompleteEnvVars.ClientID+"&grant_type=client_credentials&scope=scim.read" {
					t.Errorf("payload = %q; want %q", string(body), "client_id="+MockCompleteEnvVars.ClientID+"&grant_type=client_credentials&scope=scim.read")
				}
				w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
				// Write the privileged token so that it can be used.
				w.Write([]byte("access_token=" + privilegedToken + "&token_type=bearer"))
			} else if r.URL.Path == test.ExpectedPath {
				if r.Method != "GET" {
					t.Errorf("Tests name: (%s) Server expected method %s but instead received method %s\n", test.TestName, "GET", r.Method)
				} else {
					w.WriteHeader(test.ResponseCode)
					fmt.Fprintln(w, test.Response)
				}
				// Check that we are using the privileged token
				// This line here is why we can't use the generic CreateExternalServer.
				// Could add a token parameter. TODO
				headerAuth := r.Header.Get("Authorization")
				if headerAuth == "Basic "+privilegedToken {
					t.Errorf("Unexpected authorization header, %v is found.", headerAuth)
				}
			} else {
				t.Errorf("Unknown path. Got (%s) wanted (%s)\n", r.URL.Path, test.RequestPath)
			}
		}))
		// We can only get this after the server has started.
		test.EnvVars.UAAURL = testUAAServer.URL
		// Construct full url for the proxy.
		fullURL := fmt.Sprintf("%s%s", testUAAServer.URL, test.RequestPath)
		c := &controllers.UAAContext{SecureContext: &controllers.SecureContext{Context: &controllers.Context{}}}
		response, request, router := PrepareExternalServerCall(t, c.SecureContext, testUAAServer, fullURL, test)
		router.ServeHTTP(response, request)
		VerifyExternalCallResponse(t, response, &test)
		testUAAServer.Close()

	}
}
