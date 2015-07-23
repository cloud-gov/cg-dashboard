package helpers

var (
	ClientIDEnvVar     = "CONSOLE_CLIENT_ID"
	ClientSecretEnvVar = "CONSOLE_CLIENT_SECRET"
	HostnameEnvVar     = "CONSOLE_HOSTNAME"
	AuthURLEnvVar      = "CONSOLE_AUTH_URL"
	TokenURLEnvVar     = "CONSOLE_TOKEN_URL"
	APIEnvVar          = "CONSOLE_API"
)

type EnvVars struct {
	ClientID     string
	ClientSecret string
	Hostname     string
	AuthURL      string
	TokenURL     string
	APIURL       string
}
