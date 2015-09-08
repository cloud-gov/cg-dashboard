package controllers_test

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	. "github.com/18F/cf-deck/helpers/testhelpers"
	"testing"
)

type initAppTest struct {
	testName          string
	envVars           helpers.EnvVars
	returnRouterNil   bool
	returnSettingsNil bool
	returnErrorNil    bool
}

var initAppTests = []initAppTest{
	{
		testName:          "Basic Valid EnvVars",
		envVars:           MockCompleteEnvVars,
		returnRouterNil:   false,
		returnSettingsNil: false,
		returnErrorNil:    true,
	},
	{
		testName:          "Blank EnvVars",
		envVars:           helpers.EnvVars{},
		returnRouterNil:   true,
		returnSettingsNil: true,
		returnErrorNil:    false,
	},
}

func TestInitApp(t *testing.T) {
	for _, test := range initAppTests {
		router, settings, err := controllers.InitApp(test.envVars)
		if (router == nil) != test.returnRouterNil {
			t.Errorf("Test %s did not return correct router value. Expected %t, Actual %t", test.testName, test.returnRouterNil, (router == nil))
		} else if (settings == nil) != test.returnSettingsNil {
			t.Errorf("Test %s did not return correct settings value. Expected %t, Actual %t", test.testName, test.returnSettingsNil, (settings == nil))
		} else if (err == nil) != test.returnErrorNil {
			t.Errorf("Test %s did not return correct error value. Expected %t, Actual %t", test.testName, test.returnErrorNil, (err == nil))
		}
	}
}
