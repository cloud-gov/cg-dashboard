package helpers_test

import (
	"github.com/18F/cf-deck/helpers"
	"testing"
)

type initSettingsTest struct {
	testName        string
	envVars         helpers.EnvVars
	returnValueNull bool
}

var initSettingsTests = []initSettingsTest{
	{
		testName: "Basic Valid Settings",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
			LogURL:       "logurl",
		},
		returnValueNull: true,
	},
	{
		testName: "Missing Client ID check",
		envVars: helpers.EnvVars{
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client Secret check",
		envVars: helpers.EnvVars{
			ClientID: "ID",
			Hostname: "hostname",
			LoginURL: "loginurl",
			UAAURL:   "uaaurl",
			APIURL:   "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Hostname check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Auth URL check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Token URL check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			APIURL:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing API URL check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
		},
		returnValueNull: false,
	},
}

func TestInitSettings(t *testing.T) {
	s := helpers.Settings{}
	for _, test := range initSettingsTests {
		ret := s.InitSettings(test.envVars)
		if (ret == nil) != test.returnValueNull {
			t.Errorf("Test %s did not return correct value. Expected %t, Actual %t", test.testName, test.returnValueNull, (ret == nil))
		}
	}
}
