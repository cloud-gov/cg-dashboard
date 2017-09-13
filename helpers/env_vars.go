package helpers

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
	// LegacySessionKeyEnvVar is the old name used for a value that double for both session authentication key and CSRF token encryption key. Do not set in new deployments.
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
	// CSRFKeyEnvVar used for CSRF token. Must be 32 bytes, hex-encoded, e.g. openssl rand -hex 32. If not set, defaults to SESSION_KEY (as cast, not hex decode) for backwards compatibility.
	CSRFKeyEnvVar = "CSRF_KEY"
	// SessionAuthenticationEnvVar must be set if using "securecookie". If not set, falls back to SESSION_KEY (as cast, not hex decode) for backwards compatbility. Must be 32 or 64 hex encoded bytes, e.g. openssl rand -hex 64
	SessionAuthenticationEnvVar = "SESSION_AUTHENTICATION_KEY"
	// SessionEncryptionKeyEnvVar must be set if using "securecookie". Must be 16, 24 or 32 hex encoded bytes, e.g. openssl rand -hex 32
	SessionEncryptionKeyEnvVar = "SESSION_ENCRYPTION_KEY"
)

// EnvVars holds all the environment variable values that a non-test server should have.
type EnvVars struct {
	ClientID        string
	ClientSecret    string
	Hostname        string
	LoginURL        string
	UAAURL          string
	APIURL          string
	LogURL          string
	PProfEnabled    string
	BuildInfo       string
	NewRelicLicense string
	SecureCookies   string
	LocalCF         string
	SessionBackend  string
	BasePath        string
	SMTPHost        string
	SMTPPort        string
	SMTPUser        string
	SMTPPass        string
	SMTPFrom        string
	TICSecret       string

	CSRFKey                  []byte
	SessionAuthenticationKey []byte
	SessionEncryptionKey     []byte
}
