package helpers_test

import (
	"testing"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/govau/cf-common/env"

	"github.com/18F/cg-dashboard/helpers"
)

type initSettingsTest struct {
	testName     string
	envVars      map[string]string
	wantNilError bool
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
		wantNilError: true,
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
		wantNilError: true,
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
		wantNilError: true,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
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
		wantNilError: false,
	},
}

func TestInitSettings(t *testing.T) {
	app, _ := cfenv.Current()
	for _, tt := range initSettingsTests {
		t.Run(tt.testName, func(t *testing.T) {
			s := helpers.Settings{}
			err := s.InitSettings(
				env.NewVarSet(env.WithMapLookup(tt.envVars)),
				app,
			)
			if (err == nil) != tt.wantNilError {
				t.Errorf("return value: got %t, want %t", (err == nil), tt.wantNilError)
			}
		})
	}
}
