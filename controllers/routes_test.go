package controllers_test

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/govau/cf-common/env"

	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/helpers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
	"github.com/18F/cg-dashboard/helpers/testhelpers/mocks"
)

type initAppTest struct {
	testName          string
	envVars           map[string]string
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
		envVars:           map[string]string{},
		returnRouterNil:   true,
		returnSettingsNil: true,
		returnErrorNil:    false,
	},
}

func TestInitApp(t *testing.T) {
	for _, test := range initAppTests {
		app, _ := cfenv.Current()
		router, settings, err := controllers.InitApp(
			env.NewVarSet(env.WithMapLookup(test.envVars)),
			app,
		)
		if (router == nil) != test.returnRouterNil {
			t.Errorf("Test %s did not return correct router value. Expected %t, Actual %t", test.testName, test.returnRouterNil, (router == nil))
		} else if (settings == nil) != test.returnSettingsNil {
			t.Errorf("Test %s did not return correct settings value. Expected %t, Actual %t", test.testName, test.returnSettingsNil, (settings == nil))
		} else if (err == nil) != test.returnErrorNil {
			t.Errorf("Test %s did not return correct error value. Expected %t, Actual %t", test.testName, test.returnErrorNil, (err == nil))
		}
	}
}

type initRouterTest struct {
	testName       string
	settings       *helpers.Settings
	returnValueNil bool
}

var initRouterTests = []initRouterTest{
	{
		testName:       "Non nil Settings",
		settings:       &helpers.Settings{},
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
		router := controllers.InitRouter(test.settings, &helpers.Templates{}, &mocks.Mailer{})
		if (router == nil) != test.returnValueNil {
			t.Errorf("Test %s did not return correct router value. Expected %t, Actual %t\n", test.testName, test.returnValueNil, (router == nil))
		}
	}
}
