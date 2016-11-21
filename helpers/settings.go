package helpers

import (
	"github.com/gorilla/sessions"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"

	"encoding/gob"
	"errors"
)

// Settings is the object to hold global values and objects for the service.
type Settings struct {
	// OAuthConfig is the OAuth client with all the paramters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Console API
	ConsoleAPI string
	// Login URL - used to redirect users to the logout page
	LoginURL string
	// Sessions is the session store for all connected users.
	Sessions sessions.Store
	// context.Context var from golang.org/x/net/context to make token Client work
	TokenContext context.Context
	// Generate secure random state
	StateGenerator func() (string, error)
	// UAA API
	UaaURL string
	// Log API
	LogURL string
	// High Privileged OauthConfig
	HighPrivilegedOauthConfig *clientcredentials.Config
	// A flag to indicate whether profiling should be included (debug purposes).
	PProfEnabled bool
	// Build Info
	BuildInfo string
	//Set the secure flag on session cookies?
	SecureCookies bool
}

// InitSettings attempts to populate all the fields of the Settings struct. It will return an error if it fails,
// otherwise it returns nil for success.
func (s *Settings) InitSettings(envVars EnvVars) error {
	if len(envVars.ClientID) == 0 {
		return errors.New("Unable to find '" + ClientIDEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.ClientSecret) == 0 {
		return errors.New("Unable to find '" + ClientSecretEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.Hostname) == 0 {
		return errors.New("Unable to find '" + HostnameEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.LoginURL) == 0 {
		return errors.New("Unable to find '" + LoginURLEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.UAAURL) == 0 {
		return errors.New("Unable to find '" + UAAURLEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.APIURL) == 0 {
		return errors.New("Unable to find '" + APIURLEnvVar + "' in environment. Exiting.\n")
	}
	if len(envVars.LogURL) == 0 {
		return errors.New("Unable to find '" + LogURLEnvVar + "' in environment. Exiting.\n")
	}
	s.ConsoleAPI = envVars.APIURL
	s.LoginURL = envVars.LoginURL
	s.TokenContext = context.TODO()
	s.UaaURL = envVars.UAAURL
	s.LogURL = envVars.LogURL
	s.PProfEnabled = ((envVars.PProfEnabled == "true") || (envVars.PProfEnabled == "1"))
	if s.BuildInfo = envVars.BuildInfo; len(s.BuildInfo) == 0 {
		s.BuildInfo = "developer-build"
	}
	s.SecureCookies = ((envVars.SecureCookies == "true") || (envVars.SecureCookies == "1"))

	// Setup OAuth2 Client Service.
	s.OAuthConfig = &oauth2.Config{
		ClientID:     envVars.ClientID,
		ClientSecret: envVars.ClientSecret,
		RedirectURL:  envVars.Hostname + "/oauth2callback",
		Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  envVars.LoginURL + "/oauth/authorize",
			TokenURL: envVars.UAAURL + "/oauth/token",
		},
	}

	s.StateGenerator = func() (string, error) {
		return GenerateRandomString(32)
	}

	// Initialize Sessions.
	// Temp FIXME that fixes the problem of using a cookie store which would cause the secure encoding
	// of the oauth 2.0 token struct in production to exceed the max size of 4096 bytes.
	filesystemStore := sessions.NewFilesystemStore("", []byte(envVars.SessionKey))
	filesystemStore.MaxLength(4096 * 4)
	filesystemStore.Options = &sessions.Options{
		HttpOnly: true,
		Secure:   s.SecureCookies,
	}
	s.Sessions = filesystemStore
	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	s.HighPrivilegedOauthConfig = &clientcredentials.Config{
		ClientID:     envVars.ClientID,
		ClientSecret: envVars.ClientSecret,
		Scopes:       []string{"scim.read"},
		TokenURL:     envVars.UAAURL + "/oauth/token",
	}

	return nil
}
