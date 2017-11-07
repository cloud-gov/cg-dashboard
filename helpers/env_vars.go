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
	// LegacySessionKeyEnvVar should not be used for new installations,
	// instead CSRF_KEY or SESSION_AUTHENTICATION_KEY should be used.
	// For compatibility with legacy environments, if the new variables
	// are not set, we fallback to this variable, and cast it to []byte.
	LegacySessionKeyEnvVar = "SESSION_KEY"
	// TemplatesPathEnvVar is the path to the templates directory.
	TemplatesPathEnvVar = "TEMPLATES_PATH"
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
