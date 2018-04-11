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
			helpers.SessionEncryptionEnvVar:     "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
			helpers.SMTPHostEnvVar:              "localhost",
			helpers.SMTPCertEnvVar:				 "-----BEGIN CERTIFICATE-----
			MIIDrjCCApYCCQDdihKIIO0hnTANBgkqhkiG9w0BAQUFADCBmDELMAkGA1UEBhMC
			VVMxCzAJBgNVBAgTAkRDMRMwEQYDVQQHEwpXYXNoaW5ndG9uMQwwCgYDVQQKEwNH
			U0ExEDAOBgNVBAsTB1RUUy0xOEYxGjAYBgNVBAMTEXNtdHAuZnIuY2xvdWQuZ292
			MSswKQYJKoZIhvcNAQkBFhxjbG91ZC1nb3Ytb3BlcmF0aW9uc0Bnc2EuZ292MB4X
			DTE4MDQxMTE5MTQ0NFoXDTE5MDQxMTE5MTQ0NFowgZgxCzAJBgNVBAYTAlVTMQsw
			CQYDVQQIEwJEQzETMBEGA1UEBxMKV2FzaGluZ3RvbjEMMAoGA1UEChMDR1NBMRAw
			DgYDVQQLEwdUVFMtMThGMRowGAYDVQQDExFzbXRwLmZyLmNsb3VkLmdvdjErMCkG
			CSqGSIb3DQEJARYcY2xvdWQtZ292LW9wZXJhdGlvbnNAZ3NhLmdvdjCCASIwDQYJ
			KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKTzjVa6lJyMUmyZeT31emnH3smX3/zC
			67r61EnArvjB9f3e/L2u6f7650OY/ywsfBz8hXrI5XpdhCbyqrfI+XpkDKFoABsu
			y8anGbiDEwh8PLS4UckRZXDxG/8HBptgpkzNBoClr7XNGQa+Mk4j69949sx4uK/1
			KiMXzKnaFxuuH7t7aNgzLr8eGzwqCtJqGuzEhsl6gPVDvvUlgtSItLiu5FoQLyau
			Fkcmkoca0eyCEFW9R/zN39B0cpipMPsyDzyUJ+gP7jU7c2Z+gzNNbiN3qaNIU6pf
			olBDW70Rz6/ww8qItkazKw8OaSJV6fM6mgwlc+4IN72qug9XS4kopNECAwEAATAN
			BgkqhkiG9w0BAQUFAAOCAQEAKqPNWkXt4CJFlfsX+iBNynJTGiArsJR6FCwaNv6f
			+a31WWSCrxkvIepreUNqyGuhs0d7cT1MZMtkM9051nNFbxLqIIi7b3LZWNzwQf9G
			jRDrM8aUwh8idRUaJRWQQ+KgkOsY0iyttfLI0OLZzj39NldtDFKJrDpA4QuAKI9/
			KpMer71/GuBE6mgdKOMAgyD7D0eoPxeks0sxzs6MqC+AcMeBrpbQWCKLHaOMhgZk
			bGfWcTPRDkXJmVtA44UuNANU+Wc9aHD5ODMFU+LG3TOEK0GCcgxCrksXfwTYrNN2
			81D90R6hWY2GDdOx+T2KPAWuAZT6IgABaI9rU4/OGvisRA==
			-----END CERTIFICATE-----",
			helpers.SecureCookiesEnvVar:         "1",
			helpers.TICSecretEnvVar:             "tic",
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
			helpers.SessionEncryptionEnvVar:     "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.SessionAuthenticationEnvVar: "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
			helpers.CSRFKeyEnvVar:               "00112233445566778899aabbccddeeff",
			helpers.SMTPFromEnvVar:              "blah@blah.com",
			helpers.SMTPHostEnvVar:              "localhost",
			helpers.SMTPCertEnvVar:				 "-----BEGIN CERTIFICATE-----
			MIIDrjCCApYCCQDdihKIIO0hnTANBgkqhkiG9w0BAQUFADCBmDELMAkGA1UEBhMC
			VVMxCzAJBgNVBAgTAkRDMRMwEQYDVQQHEwpXYXNoaW5ndG9uMQwwCgYDVQQKEwNH
			U0ExEDAOBgNVBAsTB1RUUy0xOEYxGjAYBgNVBAMTEXNtdHAuZnIuY2xvdWQuZ292
			MSswKQYJKoZIhvcNAQkBFhxjbG91ZC1nb3Ytb3BlcmF0aW9uc0Bnc2EuZ292MB4X
			DTE4MDQxMTE5MTQ0NFoXDTE5MDQxMTE5MTQ0NFowgZgxCzAJBgNVBAYTAlVTMQsw
			CQYDVQQIEwJEQzETMBEGA1UEBxMKV2FzaGluZ3RvbjEMMAoGA1UEChMDR1NBMRAw
			DgYDVQQLEwdUVFMtMThGMRowGAYDVQQDExFzbXRwLmZyLmNsb3VkLmdvdjErMCkG
			CSqGSIb3DQEJARYcY2xvdWQtZ292LW9wZXJhdGlvbnNAZ3NhLmdvdjCCASIwDQYJ
			KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKTzjVa6lJyMUmyZeT31emnH3smX3/zC
			67r61EnArvjB9f3e/L2u6f7650OY/ywsfBz8hXrI5XpdhCbyqrfI+XpkDKFoABsu
			y8anGbiDEwh8PLS4UckRZXDxG/8HBptgpkzNBoClr7XNGQa+Mk4j69949sx4uK/1
			KiMXzKnaFxuuH7t7aNgzLr8eGzwqCtJqGuzEhsl6gPVDvvUlgtSItLiu5FoQLyau
			Fkcmkoca0eyCEFW9R/zN39B0cpipMPsyDzyUJ+gP7jU7c2Z+gzNNbiN3qaNIU6pf
			olBDW70Rz6/ww8qItkazKw8OaSJV6fM6mgwlc+4IN72qug9XS4kopNECAwEAATAN
			BgkqhkiG9w0BAQUFAAOCAQEAKqPNWkXt4CJFlfsX+iBNynJTGiArsJR6FCwaNv6f
			+a31WWSCrxkvIepreUNqyGuhs0d7cT1MZMtkM9051nNFbxLqIIi7b3LZWNzwQf9G
			jRDrM8aUwh8idRUaJRWQQ+KgkOsY0iyttfLI0OLZzj39NldtDFKJrDpA4QuAKI9/
			KpMer71/GuBE6mgdKOMAgyD7D0eoPxeks0sxzs6MqC+AcMeBrpbQWCKLHaOMhgZk
			bGfWcTPRDkXJmVtA44UuNANU+Wc9aHD5ODMFU+LG3TOEK0GCcgxCrksXfwTYrNN2
			81D90R6hWY2GDdOx+T2KPAWuAZT6IgABaI9rU4/OGvisRA==
			-----END CERTIFICATE-----",
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
	{
		testName: "Invalid SMTP Certificate",
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
			helpers.SMTPCertEnvVar: 			 "12345",
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
