package main

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/testhelpers/mocks"
)

type initAppTest struct {
	testName          string
	envVars           EnvVars
	returnRouterNil   bool
	returnSettingsNil bool
	returnErrorNil    bool
}

var initAppTests = []initAppTest{
	{
		testName:          "Basic Valid EnvVars",
		envVars:           GetMockCompleteEnvVars(),
		returnRouterNil:   false,
		returnSettingsNil: false,
		returnErrorNil:    true,
	},
	{
		testName:          "Blank EnvVars",
		envVars:           EnvVars{},
		returnRouterNil:   true,
		returnSettingsNil: true,
		returnErrorNil:    false,
	},
}

func TestInitApp(t *testing.T) {
	for _, test := range initAppTests {
		t.Run(test.testName, func(t *testing.T) {
			env, _ := cfenv.Current()
			cleanup := CreateDefaultV2InfoEndpoint(test.envVars)
			defer cleanup()
			router, settings, err := controllers.InitApp(test.envVars, env)
			if (router == nil) != test.returnRouterNil {
				t.Errorf("Test %s did not return correct router value. Expected %t, Actual %t", test.testName, test.returnRouterNil, (router == nil))
			} else if (settings == nil) != test.returnSettingsNil {
				t.Errorf("Test %s did not return correct settings value. Expected %t, Actual %t", test.testName, test.returnSettingsNil, (settings == nil))
			} else if (err == nil) != test.returnErrorNil {
				t.Errorf("Test %s did not return correct error value. Expected %t, Actual %t", test.testName, test.returnErrorNil, (err == nil))
			}
		})
	}
}

type initRouterTest struct {
	testName       string
	settings       *Settings
	returnValueNil bool
}

var initRouterTests = []initRouterTest{
	{
		testName:       "Non nil Settings",
		settings:       &Settings{},
		returnValueNil: false,
	},
	{
		testName:       "Nil Settings",
		settings:       nil,
		returnValueNil: true,
	},
}

func TestInitRouter(t *testing.T) {
	for _, test := range initRouterTests {
		t.Run(test.testName, func(t *testing.T) {
			router := controllers.InitRouter(test.settings, &Templates{}, &mocks.Mailer{})
			if (router == nil) != test.returnValueNil {
				t.Errorf("Test %s did not return correct router value. Expected %t, Actual %t\n", test.testName, test.returnValueNil, (router == nil))
			}
		})
	}
}
