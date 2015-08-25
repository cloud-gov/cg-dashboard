package helpers

import (
	"github.com/gorilla/sessions"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"

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
	// UAA API
	UaaURL string
	// A flag to indicate whether profiling should be included (debug purposes).
	PProfEnabled bool
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
	s.ConsoleAPI = envVars.APIURL
	s.LoginURL = envVars.LoginURL
	s.TokenContext = context.TODO()
	s.UaaURL = envVars.UAAURL
	if len(envVars.APIURL) == 0 {
		s.PProfEnabled = false
	} else {
		s.PProfEnabled = ((envVars.PProfEnabled == "true") || (envVars.PProfEnabled == "1"))
	}

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

	// Initialize Sessions.
	store := sessions.NewCookieStore([]byte("some key"))
	s.Sessions = store

	return nil
}
