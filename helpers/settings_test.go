package helpers_test

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/helpers/testhelpers"
)

type initSettingsTest struct {
	testName        string
	envVars         map[string]string
	returnValueNull bool
}

var initSettingsTests = []initSettingsTest{
	{
		testName: "Basic Valid Production CF Settings",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionBackendEnvVar:        "cookiestore",
			helpers.SessionEncryptionEnvVar:     "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
			helpers.SMTPHostEnvVar:              "localhost",
			helpers.SecureCookiesEnvVar:         "1",
			helpers.TICSecretEnvVar:             "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Valid Legacy Session Key CF Settings",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:         "ID",
			helpers.ClientSecretEnvVar:     "Secret",
			helpers.HostnameEnvVar:         "hostname",
			helpers.LoginURLEnvVar:         "loginurl",
			helpers.UAAURLEnvVar:           "uaaurl",
			helpers.APIURLEnvVar:           "apiurl",
			helpers.LogURLEnvVar:           "logurl",
			helpers.LegacySessionKeyEnvVar: "lalala",
			helpers.SMTPFromEnvVar:         "blah@blah.com",
			helpers.SMTPHostEnvVar:         "localhost",
			helpers.SecureCookiesEnvVar:    "1",
			helpers.TICSecretEnvVar:        "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Valid Local CF Settings",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionBackendEnvVar:        "cookiestore",
			helpers.SessionEncryptionEnvVar:     "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
			helpers.SMTPHostEnvVar:              "localhost",
			helpers.SecureCookiesEnvVar:         "0",
			helpers.LocalCFEnvVar:               "1",
			helpers.TICSecretEnvVar:             "tic",
		},
		returnValueNull: true,
	},
	{
		testName: "Basic Invalid Prod CF Settings",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
			helpers.SMTPHostEnvVar:              "localhost",
			helpers.LocalCFEnvVar:               "0",
			helpers.TICSecretEnvVar:             "tic",
			// Let SecureCookies Default to false (similar to what would happen in real life).
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client ID check",
		envVars: map[string]string{
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Client Secret check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Hostname check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Auth URL check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Token URL check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing API URL check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.LogURLEnvVar:                "logurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Log URL check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing Session Key check",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:     "ID",
			helpers.ClientSecretEnvVar: "Secret",
			helpers.HostnameEnvVar:     "hostname",
			helpers.LoginURLEnvVar:     "loginurl",
			helpers.UAAURLEnvVar:       "uaaurl",
			helpers.APIURLEnvVar:       "apiurl",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP From",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
		},
		returnValueNull: false,
	},
	{
		testName: "Missing SMTP Host",
		envVars: map[string]string{
			helpers.ClientIDEnvVar:              "ID",
			helpers.ClientSecretEnvVar:          "Secret",
			helpers.HostnameEnvVar:              "hostname",
			helpers.LoginURLEnvVar:              "loginurl",
			helpers.UAAURLEnvVar:                "uaaurl",
			helpers.APIURLEnvVar:                "apiurl",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
		},
		returnValueNull: false,
	},
}

func TestInitSettings(t *testing.T) {
	env, _ := cfenv.Current()
	for _, test := range initSettingsTests {
		s := helpers.Settings{}
		ret := s.InitSettings(helpers.NewEnvVarsFromPath(testhelpers.NewEnvLookupFromMap(test.envVars)), env)
		if (ret == nil) != test.returnValueNull {
			t.Errorf("Test %s did not return correct value. Expected %t, Actual %t", test.testName, test.returnValueNull, (ret == nil))
		}
	}
}
