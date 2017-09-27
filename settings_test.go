package main_test

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/helpers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers"
)

type initSettingsTest struct {
	testName        string
	envVars         helpers.EnvVars
	returnValueNull bool
}

var initSettingsTests = []initSettingsTest{
	{
		testName: "Basic Valid Production CF Settings",
		envVars: helpers.EnvVars{
			ClientID:      "ID",
			ClientSecret:  "Secret",
			Hostname:      "hostname",
			APIURL:        "https://apiurl.com",
			SessionKey:    "lalala",
			SMTPFrom:      "blah@blah.com",
			SMTPHost:      "localhost",
			SecureCookies: "1",
			TICSecret:     "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Valid Local CF Settings",
		envVars: helpers.EnvVars{
			ClientID:      "ID",
			ClientSecret:  "Secret",
			Hostname:      "hostname",
			APIURL:        "https://apiurl.com",
			SessionKey:    "lalala",
			SMTPFrom:      "blah@blah.com",
			SMTPHost:      "localhost",
			SecureCookies: "0",
			LocalCF:       "1",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Invalid Prod CF Settings",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			APIURL:       "https://apiurl.com",
			SessionKey:   "lalala",
			SMTPFrom:     "blah@blah.com",
			SMTPHost:     "localhost",
			LocalCF:      "0",
			TICSecret:    "tic",
			// Let SecureCookies Default to false (similar to what would happen in real life).
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client ID check",
		envVars: helpers.EnvVars{
			ClientSecret: "Secret",
			Hostname:     "hostname",
			APIURL:       "https://apiurl.com",
			SessionKey:   "lalala",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client Secret check",
		envVars: helpers.EnvVars{
			ClientID:   "ID",
			Hostname:   "hostname",
			APIURL:     "https://apiurl.com",
			SessionKey: "lalala",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Hostname check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			APIURL:       "https://apiurl.com",
			SessionKey:   "lalala",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing API URL check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			SessionKey:   "lalala",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Session Key check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			APIURL:       "https://apiurl.com",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP From",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			APIURL:       "https://apiurl.com",
			SessionKey:   "blah",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP Host",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			APIURL:       "https://apiurl.com",
			SessionKey:   "blah",
			SMTPFrom:     "blah@blah.com",
		},
		returnValueNull: false,
	},
}

func TestInitSettings(t *testing.T) {
	s := helpers.Settings{}
	env, _ := cfenv.Current()
	for _, test := range initSettingsTests {
		t.Run(test.testName, func(t *testing.T) {
			cleanup := CreateDefaultV2InfoEndpoint(test.envVars)
			defer cleanup()
			ret := s.InitSettings(test.envVars, env)
			if (ret == nil) != test.returnValueNull {
				t.Errorf("Test %s did not return correct value. Expected %t, Actual %t",
					test.testName, test.returnValueNull, (ret == nil))
				if ret != nil {
					t.Logf("Found error %s", ret)
				}
			}
		})
	}
}
