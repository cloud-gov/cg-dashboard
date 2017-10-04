package helpers_test

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/helpers"
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
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
			SMTPFrom:                 "blah@blah.com",
			SMTPHost:                 "localhost",
			SecureCookies:            "1",
			TICSecret:                "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Valid Local CF Settings",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
			SMTPFrom:                 "blah@blah.com",
			SMTPHost:                 "localhost",
			SecureCookies:            "0",
			LocalCF:                  "1",
			TICSecret:                "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Invalid Prod CF Settings",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
			SMTPFrom:                 "blah@blah.com",
			SMTPHost:                 "localhost",
			LocalCF:                  "0",
			TICSecret:                "tic",
			// Let SecureCookies Default to false (similar to what would happen in real life).
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client ID check",
		envVars: helpers.EnvVars{
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client Secret check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Hostname check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Auth URL check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Token URL check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			APIURL:                   "apiurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing API URL check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			LogURL:                   "logurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Log URL check",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			CSRFKey:                  []byte("lalala"),
			SessionAuthenticationKey: []byte("lalala"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Session Key check",
		envVars: helpers.EnvVars{
			ClientID:     "ID",
			ClientSecret: "Secret",
			Hostname:     "hostname",
			LoginURL:     "loginurl",
			UAAURL:       "uaaurl",
			APIURL:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP From",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			CSRFKey:                  []byte("blah"),
			SessionAuthenticationKey: []byte("blah"),
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP Host",
		envVars: helpers.EnvVars{
			ClientID:                 "ID",
			ClientSecret:             "Secret",
			Hostname:                 "hostname",
			LoginURL:                 "loginurl",
			UAAURL:                   "uaaurl",
			APIURL:                   "apiurl",
			CSRFKey:                  []byte("blah"),
			SessionAuthenticationKey: []byte("blah"),
			SMTPFrom:                 "blah@blah.com",
		},
		returnValueNull: false,
	},
}

func TestInitSettings(t *testing.T) {
	s := helpers.Settings{}
	env, _ := cfenv.Current()
	for _, test := range initSettingsTests {
		ret := s.InitSettings(test.envVars, env)
		if (ret == nil) != test.returnValueNull {
			t.Errorf("Test %s did not return correct value. Expected %t, Actual %t", test.testName, test.returnValueNull, (ret == nil))
		}
	}
}
