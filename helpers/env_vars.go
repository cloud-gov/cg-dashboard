package helpers

var (
	ClientIDEnvVar     = "CONSOLE_CLIENT_ID"
	ClientSecretEnvVar = "CONSOLE_CLIENT_SECRET"
	HostnameEnvVar     = "CONSOLE_HOSTNAME"
	LoginURLEnvVar     = "CONSOLE_LOGIN_URL"
	UAAURLEnvVar       = "CONSOLE_UAA_URL"
	APIURLEnvVar       = "CONSOLE_API_URL"
)

type EnvVars struct {
	ClientID     string
	ClientSecret string
	Hostname     string
	LoginURL     string
	UAAURL       string
	APIURL       string
}
