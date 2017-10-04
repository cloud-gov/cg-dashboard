package helpers

import (
	"fmt"
	"log"
	"strconv"

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
	// LoginURLEnvVar is the environment variable key that represents the
	// base login URL endpoint that this app should use to authenticate users.
	LoginURLEnvVar = "CONSOLE_LOGIN_URL"
	// UAAURLEnvVar is the environment variable key that represents the
	//  base uaa URL endpoint that this app should use to get tokens.
	UAAURLEnvVar = "CONSOLE_UAA_URL"
	// APIURLEnvVar is the environment variable key that represents the
	// base api URL endpoint that this app should use to access Cloud Foundry data.
	APIURLEnvVar = "CONSOLE_API_URL"
	// LogURLEnvVar is the environment variable key that represents the
	// endpoint to the loggregator.
	LogURLEnvVar = "CONSOLE_LOG_URL"
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
	// LegacySessionKeyEnvVar should not be used for new installations,
	// instead CSRF_KEY or SESSION_AUTHENTICATION_KEY should be used.
	// For compatibility with legacy environments, if the new variables
	// are not set, we fallback to this variable, and cast it to []byte.
	LegacySessionKeyEnvVar = "SESSION_KEY"
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
	// CSRFKeyEnvVar is used for CSRF token. Must be 32 bytes, hex-encoded, e.g. openssl rand -hex 32
	CSRFKeyEnvVar = "CSRF_KEY"
	// SessionAuthenticationEnvVar used to sign user sessions. Must be 32 or 64 hex-encoded bytes, e.g. openssl rand -hex 64
	SessionAuthenticationEnvVar = "SESSION_AUTHENTICATION_KEY"
	// SessionEncryptionEnvVar used to encrypt user sessions. Used by "SESSION_BACKEND=cookiestore". Must be 16, 24 or 32 hex-encoded bytes, e.g. openssl rand -hex 32
	SessionEncryptionEnvVar = "SESSION_ENCRYPTION_KEY"
)

// EnvVars provides a convenient method to access environment variables
type EnvVars struct {
	path []EnvLookup
}

// String returns value for key if present, else returns defaultVal if not found
func (el *EnvVars) String(key, defaultVal string) string {
	rv, found := el.load(key)
	if !found {
		return defaultVal
	}
	return rv
}

// MustString will panic if value is not set, otherwise it returns the value.
func (el *EnvVars) MustString(key string) string {
	rv, found := el.load(key)
	if !found {
		panic(&ErrMissingEnvVar{Name: key})
	}
	return rv
}

// Bool looks for the key, and if found, parses it using strconv.ParseBool and returns
// the result. If not found, returns false. If found and won't parse, panics.
func (el *EnvVars) Bool(key string) bool {
	val, found := el.load(key)
	if !found {
		return false
	}

	rv, err := strconv.ParseBool(val)
	if err != nil {
		// invalid values will now return an error
		// previous behavior defaulted to false
		panic(err)
	}

	return rv
}

// load is an internal method that looks for a given key within
// all elements in the path, and if none found, returns "", false.
func (el *EnvVars) load(key string) (string, bool) {
	for _, env := range el.path {
		rv, found := env(key)
		if found {
			return rv, true
		}
	}
	return "", false
}

// NewEnvVarsFromPath create an EnvVars object, where the elements in the path
// are searched in order to load a given variable.
func NewEnvVarsFromPath(path ...EnvLookup) *EnvVars {
	return &EnvVars{path: path}
}

// EnvLookup must return the value for the given key and whether it was found or not
type EnvLookup func(key string) (string, bool)

// ErrMissingEnvVar is panicked if a MustGet fails.
type ErrMissingEnvVar struct {
	// Name of the key that was not found
	Name string
}

// Error returns an error string
func (err *ErrMissingEnvVar) Error() string {
	return fmt.Sprintf("missing env variable: %s", err.Name)
}

// NewEnvLookupFromCFAppNamedService looks for a CloudFoundry bound service
// with the given name, and will allow sourcing of environment variables
// from there. If no service is found, a warning is printed, but no error thrown.
func NewEnvLookupFromCFAppNamedService(cfApp *cfenv.App, namedService string) EnvLookup {
	var service *cfenv.Service
	if cfApp != nil {
		var err error
		service, err = cfApp.Services.WithName(namedService)
		if err != nil {
			// swallow error, as we'll print message below anyway, but ensure service hasn't been assigned to
			service = nil
		}
	}
	if service == nil {
		log.Printf("Warning: No bound service found with name: %s, will not be used for sourcing env variables.\n", namedService)
	}
	return func(name string) (string, bool) {
		if service == nil { // no service
			return "", false
		}
		serviceVar, found := service.Credentials[name]
		if !found {
			return "", false
		}
		serviceVarAsString, ok := serviceVar.(string)
		if !ok {
			log.Printf("Warning: variable found in service for %s, but unable to cast as string, so ignoring.\n", name)
			return "", false
		}
		return serviceVarAsString, true
	}
}
