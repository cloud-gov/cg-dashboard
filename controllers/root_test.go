package controllers_test

import (
	"os"
	"strings"
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/controllers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
)

func TestPing(t *testing.T) {
	response, request := NewTestRequest("GET", "/ping", nil)
	env, _ := cfenv.Current()
	router, _, _ := controllers.InitApp(GetMockCompleteEnvVars(), env)
	router.ServeHTTP(response, request)
	expectedResponse := `{"status":"alive","build-info":"developer-build","session-store-health":{"store-type":"file","store-up":true}}`
	if response.Body.String() != expectedResponse {
		t.Errorf("Expected %s. Found %s\n", expectedResponse, response.Body.String())
	}
}

func TestPingWithRedis(t *testing.T) {
	// Create a request
	response, request := NewTestRequest("GET", "/ping", nil)
	// Start up redis.
	redisUri, cleanUpRedis := CreateTestRedis()
	os.Setenv("REDIS_URI", redisUri)
	// Override the mock env vars to use redis for session backend.
	envVars := GetMockCompleteEnvVars()
	envVars.SessionBackend = "redis"
	env, _ := cfenv.Current()

	// Submit PING with healthy Redis instance.
	router, _, _ := controllers.InitApp(envVars, env)
	router.ServeHTTP(response, request)
	expectedResponse := `{"status":"alive","build-info":"developer-build","session-store-health":{"store-type":"redis","store-up":true}}`
	if response.Body.String() != expectedResponse {
		t.Errorf("Expected %s. Found %s\n", expectedResponse, response.Body.String())
	}
	// Remove redis.
	cleanUpRedis()

	// Try ping again with unhealthy Redis instance.
	response, request = NewTestRequest("GET", "/ping", nil)
	router.ServeHTTP(response, request)
	expectedResponse = `{"status":"outage","build-info":"developer-build","session-store-health":{"store-type":"redis","store-up":false}}`
	if response.Body.String() != expectedResponse {
		t.Errorf("Expected %s. Found %s\n", expectedResponse, response.Body.String())
	}
}

var loginHandshakeTests = []BasicConsoleUnitTest{
	{
		TestName:    "Login Handshake With Already Authenticated User",
		EnvVars:     GetMockCompleteEnvVars(),
		Code:        302,
		Location:    "https://hostname/#/dashboard",
		SessionData: ValidTokenData,
	},
	{
		TestName: "Login Handshake With Non Authenticated User",
		EnvVars:  GetMockCompleteEnvVars(),
		Code:     302,
		Location: "https://loginurl/oauth/authorize",
	},
}

func TestLoginHandshake(t *testing.T) {
	response, request := NewTestRequest("GET", "/handshake", nil)
	for _, test := range loginHandshakeTests {
		router, _ := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		// Check the return code.
		if response.Code != test.Code {
			t.Errorf("Expected http code %d, Found http code %d\n", test.Code, response.Code)
		}
		// Check the location of where we relocated to.
		if !strings.Contains(response.Header().Get("Location"), test.Location) {
			t.Errorf("Expected http location %s, Found http code %s\n", test.Location, response.Header().Get("Location"))
		}
	}

}

var logoutTests = []BasicSecureTest{
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName:    "Basic Authorized Profile To Logout",
			EnvVars:     GetMockCompleteEnvVars(),
			SessionData: ValidTokenData,
		},
		ExpectedResponse: "https://loginurl/logout.do",
	},
	{
		BasicConsoleUnitTest: BasicConsoleUnitTest{
			TestName: "Basic Unauthorized Profile To Logout",
			EnvVars:  GetMockCompleteEnvVars(),
		},
		ExpectedResponse: "https://loginurl/logout.do",
	},
}

func TestLogout(t *testing.T) {
	for _, test := range logoutTests {
		// Create request
		response, request := NewTestRequest("GET", "/logout", nil)

		router, store := CreateRouterWithMockSession(test.SessionData, test.EnvVars)
		router.ServeHTTP(response, request)
		location := response.Header().Get("location")
		if location != test.ExpectedResponse {
			t.Errorf("Logout route does not redirect to logout page (%s:%s)", location, test.ExpectedResponse)
		}
		if store.Session.Options.MaxAge != -1 {
			t.Errorf("Logout does not change MaxAge to -1")
		}
		if store.Session.Values["token"] != nil {
			t.Errorf("Logout does not clear the token stored in the session")
		}
	}
}
