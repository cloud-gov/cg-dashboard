package main

import (
	"errors"
	"fmt"
	"os"
	"strings"

	cfenv "github.com/cloudfoundry-community/go-cfenv"
)

var (
	// ClientIDEnvVar is the environment variable key that represents the registered
	// Client ID for this web app.
	ClientIDEnvVar = "CONSOLE_CLIENT_ID"
	// ClientSecretEnvVar is the environment variable key that represents the
	// Client Secret associated with the registered Client ID for this web app.
	ClientSecretEnvVar = "CONSOLE_CLIENT_SECRET"
	// HostnameEnvVar is the environment variable key that represents the hostname
	// of this web app.
	HostnameEnvVar = "CONSOLE_HOSTNAME"
	// APIURLEnvVar is the environment variable key that represents the
	// base api URL endpoint that this app should use to access Cloud Foundry data.
	APIURLEnvVar = "CONSOLE_API_URL"
	// PProfEnabledEnvVar is the environment variable key that represents if the pprof routes
	// should be enabled. If no value is specified, it is assumed to be false.
	PProfEnabledEnvVar = "PPROF_ENABLED"
	// BuildInfoEnvVar is the environment variable key that represents the particular build number
	BuildInfoEnvVar = "BUILD_INFO"
	// NewRelicLicenseEnvVar is the New Relic License key so it can collect data.
	NewRelicLicenseEnvVar = "CONSOLE_NEW_RELIC_LICENSE"
	// SecureCookiesEnvVar is set to true or 1, then set the Secure flag be set on session coookies
	SecureCookiesEnvVar = "SECURE_COOKIES"
	// LocalCFEnvVar is set to true or 1, then we indicate that we are using a local CF env.
	LocalCFEnvVar = "LOCAL_CF"
	// SessionBackendEnvVar is the session backend type
	SessionBackendEnvVar = "SESSION_BACKEND"
	// SessionKeyEnvVar is the secret key used to protect session data
	SessionKeyEnvVar = "SESSION_KEY"
	// BasePathEnvVar is the path to the application root
	BasePathEnvVar = "BASE_PATH"
	// SMTPHostEnvVar is SMTP host for UAA invites
	SMTPHostEnvVar = "SMTP_HOST"
	// SMTPPortEnvVar is SMTP post for UAA invites
	SMTPPortEnvVar = "SMTP_PORT"
	// SMTPUserEnvVar is SMTP user for UAA invites
	SMTPUserEnvVar = "SMTP_USER"
	// SMTPPassEnvVar is SMTP password for UAA invites
	SMTPPassEnvVar = "SMTP_PASS"
	// SMTPFromEnvVar is SMTP from address for UAA invites
	SMTPFromEnvVar = "SMTP_FROM"
	// TICSecretEnvVar is the shared secret with CF API proxy for forwarding client IPs
	TICSecretEnvVar = "TIC_SECRET"
)

// EnvVars holds all the environment variable values that a non-test server should have.
type EnvVars struct {
	ClientID        string
	ClientSecret    string
	Hostname        string
	APIURL          string
	PProfEnabled    string
	BuildInfo       string
	NewRelicLicense string
	SecureCookies   string
	LocalCF         string
	SessionBackend  string
	SessionKey      string
	BasePath        string
	SMTPHost        string
	SMTPPort        string
	SMTPUser        string
	SMTPPass        string
	SMTPFrom        string
	TICSecret       string
}

// validate will check the environment variables
// for the required ones.
func (e *EnvVars) validate() error {
	if len(e.ClientID) == 0 {
		return errors.New("Unable to find '" + ClientIDEnvVar + "' in environment. Exiting.\n")
	}
	if len(e.ClientSecret) == 0 {
		return errors.New("Unable to find '" + ClientSecretEnvVar + "' in environment. Exiting.\n")
	}
	if len(e.Hostname) == 0 {
		return errors.New("Unable to find '" + HostnameEnvVar + "' in environment. Exiting.\n")
	}
	if len(e.APIURL) == 0 {
		return errors.New("Unable to find '" + APIURLEnvVar + "' in environment. Exiting.\n")
	}
	if len(e.SessionKey) == 0 {
		return errors.New("Unable to find '" + SessionKeyEnvVar + "' in environment. Exiting.\n")
	}
	return nil
}

// IsPProfEnabled returns true if the Env Var is equal to
// "true" (case insensitive) or 1.
func (e *EnvVars) IsPProfEnabled() bool {
	return (strings.EqualFold(e.PProfEnabled, "true") || (e.PProfEnabled == "1"))
}

// IsUsingLocalCF returns true if the Env Var is equal to
// "true" (case insensitive) or 1.
func (e *EnvVars) IsUsingLocalCF() bool {
	return (strings.EqualFold(e.LocalCF, "true") || (e.LocalCF == "1"))
}

// IsUsingSecureCookies returns true if the Env Var is equal
// to "true" (case insensitive) or 1.
func (e *EnvVars) IsUsingSecureCookies() bool {
	return (strings.EqualFold(e.SecureCookies, "true") || (e.SecureCookies == "1"))
}

func loadEnvVars() EnvVars {
	envVars := EnvVars{}

	envVars.ClientID = os.Getenv(ClientIDEnvVar)
	envVars.ClientSecret = os.Getenv(ClientSecretEnvVar)
	envVars.Hostname = os.Getenv(HostnameEnvVar)
	envVars.APIURL = os.Getenv(APIURLEnvVar)
	envVars.PProfEnabled = os.Getenv(PProfEnabledEnvVar)
	envVars.BuildInfo = os.Getenv(BuildInfoEnvVar)
	envVars.NewRelicLicense = os.Getenv(NewRelicLicenseEnvVar)
	envVars.SecureCookies = os.Getenv(SecureCookiesEnvVar)
	envVars.LocalCF = os.Getenv(LocalCFEnvVar)
	envVars.SessionBackend = os.Getenv(SessionBackendEnvVar)
	envVars.SessionKey = os.Getenv(SessionKeyEnvVar)
	envVars.BasePath = os.Getenv(BasePathEnvVar)
	envVars.SMTPHost = os.Getenv(SMTPHostEnvVar)
	envVars.SMTPPort = os.Getenv(SMTPPortEnvVar)
	envVars.SMTPUser = os.Getenv(SMTPUserEnvVar)
	envVars.SMTPPass = os.Getenv(SMTPPassEnvVar)
	envVars.SMTPFrom = os.Getenv(SMTPFromEnvVar)
	envVars.TICSecret = os.Getenv(TICSecretEnvVar)
	return envVars
}

func replaceEnvVar(envVars *EnvVars, envVar string, value interface{}) {
	if stringValue, ok := value.(string); ok {
		// only replace if non empty.
		if len(stringValue) < 1 {
			return
		}
		switch envVar {
		case ClientIDEnvVar:
			envVars.ClientID = stringValue
		case ClientSecretEnvVar:
			envVars.ClientSecret = stringValue
		case NewRelicLicenseEnvVar:
			envVars.NewRelicLicense = stringValue
		case SessionKeyEnvVar:
			envVars.SessionKey = stringValue
		case SMTPHostEnvVar:
			envVars.SMTPHost = stringValue
		case SMTPPortEnvVar:
			envVars.SMTPPort = stringValue
		case SMTPUserEnvVar:
			envVars.SMTPUser = stringValue
		case SMTPPassEnvVar:
			envVars.SMTPPass = stringValue
		case SMTPFromEnvVar:
			envVars.SMTPFrom = stringValue
		case TICSecretEnvVar:
			envVars.TICSecret = stringValue
		}
	}
}

func loadUPSVars(envVars *EnvVars, cfEnv *cfenv.App) {
	if cfEnv == nil {
		return
	}

	if cfUPS, err := cfEnv.Services.WithName(cfUserProvidedService); err == nil {
		fmt.Println("User Provided Service found")
		if clientID, found := cfUPS.Credentials[ClientIDEnvVar]; found {
			fmt.Println("Replacing " + ClientIDEnvVar)
			replaceEnvVar(envVars, ClientIDEnvVar, clientID)
		}
		if clientSecret, found := cfUPS.Credentials[ClientSecretEnvVar]; found {
			fmt.Println("Replacing " + ClientSecretEnvVar)
			replaceEnvVar(envVars, ClientSecretEnvVar, clientSecret)
		}
		if newRelic, found := cfUPS.Credentials[NewRelicLicenseEnvVar]; found {
			fmt.Println("Replacing " + NewRelicLicenseEnvVar)
			replaceEnvVar(envVars, NewRelicLicenseEnvVar, newRelic)
		}
		if sessionKey, found := cfUPS.Credentials[SessionKeyEnvVar]; found {
			fmt.Println("Replacing " + SessionKeyEnvVar)
			replaceEnvVar(envVars, SessionKeyEnvVar, sessionKey)
		}
		if smtpFrom, found := cfUPS.Credentials[SMTPFromEnvVar]; found {
			fmt.Println("Replacing " + SMTPFromEnvVar)
			replaceEnvVar(envVars, SMTPFromEnvVar, smtpFrom)
		}
		if smtpHost, found := cfUPS.Credentials[SMTPHostEnvVar]; found {
			fmt.Println("Replacing " + SMTPHostEnvVar)
			replaceEnvVar(envVars, SMTPHostEnvVar, smtpHost)
		}
		if smtpPass, found := cfUPS.Credentials[SMTPPassEnvVar]; found {
			fmt.Println("Replacing " + SMTPPassEnvVar)
			replaceEnvVar(envVars, SMTPPassEnvVar, smtpPass)
		}
		if smtpPort, found := cfUPS.Credentials[SMTPPortEnvVar]; found {
			fmt.Println("Replacing " + SMTPPortEnvVar)
			replaceEnvVar(envVars, SMTPPortEnvVar, smtpPort)
		}
		if smtpUser, found := cfUPS.Credentials[SMTPUserEnvVar]; found {
			fmt.Println("Replacing " + SMTPUserEnvVar)
			replaceEnvVar(envVars, SMTPUserEnvVar, smtpUser)
		}
		if ticSecret, found := cfUPS.Credentials[TICSecretEnvVar]; found {
			fmt.Println("Replacing " + TICSecretEnvVar)
			replaceEnvVar(envVars, TICSecretEnvVar, ticSecret)
		}

	} else {
		fmt.Println("CF Env error: " + err.Error())
	}
}
