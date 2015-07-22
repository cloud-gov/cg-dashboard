package helpers

import (
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"encoding/gob"
	"errors"
	"os"
)

// Settings is the object to hold global values and objects for the service.
type Settings struct {
	// OAuthConfig is the OAuth client with all the paramters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Console API
	ConsoleAPI string
	// Sessions is the session store for all connected users.
	Sessions sessions.Store
}

// InitSettings attempts to populate all the fields of the Settings struct. It will return an error if it fails,
// otherwise it returns nil for success.
func (s *Settings) InitSettings() error {
	// Load the variables from the environment.
	var clientID string
	var clientSecret string
	var hostname string
	var authURL string
	var tokenURL string

	if clientID = os.Getenv("CONSOLE_CLIENT_ID"); len(clientID) == 0 {
		return errors.New("Unable to find 'CONSOLE_CLIENT_ID' in environment. Exiting.\n")
	}
	if clientSecret = os.Getenv("CONSOLE_CLIENT_SECRET"); len(clientSecret) == 0 {
		return errors.New("Unable to find 'CONSOLE_CLIENT_SECRET' in environment. Exiting.\n")
	}
	if hostname = os.Getenv("CONSOLE_HOSTNAME"); len(hostname) == 0 {
		return errors.New("Unable to find 'CONSOLE_HOSTNAME' in environment. Exiting.\n")
	}
	if authURL = os.Getenv("CONSOLE_AUTH_URL"); len(authURL) == 0 {
		return errors.New("Unable to find 'CONSOLE_AUTH_URL' in environment. Exiting.\n")
	}
	if tokenURL = os.Getenv("CONSOLE_TOKEN_URL"); len(tokenURL) == 0 {
		return errors.New("Unable to find 'CONSOLE_TOKEN_URL' in environment. Exiting.\n")
	}
	if s.ConsoleAPI = os.Getenv("CONSOLE_API"); len(s.ConsoleAPI) == 0 {
		return errors.New("Unable to find 'CONSOLE_API' in environment. Exiting.\n")
	}

	// Setup OAuth2 Client Service.
	s.OAuthConfig = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  hostname + "/oauth2callback",
		Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  authURL,
			TokenURL: tokenURL,
		},
	}

	// Initialize Sessions.
	// Temp FIXME that fixes the problem of using a cookie store which would cause the secure encoding
	// of the oauth 2.0 token struct in production to exceed the max size of 4096 bytes.
	filesystemStore := sessions.NewFilesystemStore("", []byte("some key"))
	filesystemStore.MaxLength(4096 * 4)
	s.Sessions = filesystemStore
	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	return nil
}
