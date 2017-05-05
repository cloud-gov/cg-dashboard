package helpers

import (
	"encoding/gob"
	"errors"
	"fmt"
	"net/url"
	"os"

	"github.com/boj/redistore"
	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gorilla/sessions"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
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
	// URL where this app is hosted
	AppURL string
	// SMTP host for UAA invites
	SMTPHost string
	// SMTP post for UAA invites
	SMTPPort string
	// SMTP user for UAA invites
	SMTPUser string
	// SMTP password for UAA invites
	SMTPPass string
	// SMTP from address for UAA invites
	SMTPFrom string
}

// InitSettings attempts to populate all the fields of the Settings struct. It will return an error if it fails,
// otherwise it returns nil for success.
func (s *Settings) InitSettings(envVars EnvVars, env *cfenv.App) error {
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
	if len(envVars.SessionKey) == 0 {
		return errors.New("Unable to find '" + SessionKeyEnvVar + "' in environment. Exiting.\n")
	}

	s.AppURL = envVars.Hostname
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
		RedirectURL:  s.AppURL + "/oauth2callback",
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
	switch envVars.SessionBackend {
	case "redis":
		address, password, err := getRedisSettings(env)
		if err != nil {
			return err
		}
		store, err := redistore.NewRediStore(10, "tcp", address, password, []byte(envVars.SessionKey))
		if err != nil {
			return err
		}
		store.SetMaxLength(4096 * 4)
		store.Options = &sessions.Options{
			HttpOnly: true,
			MaxAge:   60 * 60 * 24 * 7,
			Path:     "/",
			Secure:   s.SecureCookies,
		}
		s.Sessions = store
	default:
		store := sessions.NewFilesystemStore("", []byte(envVars.SessionKey))
		store.MaxLength(4096 * 4)
		store.Options = &sessions.Options{
			HttpOnly: true,
			// TODO remove this; work-around for
			// https://github.com/gorilla/sessions/issues/96
			MaxAge: 60 * 60 * 24 * 7,
			Path:   "/",
			Secure: s.SecureCookies,
		}
		s.Sessions = store
	}

	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	s.HighPrivilegedOauthConfig = &clientcredentials.Config{
		ClientID:     envVars.ClientID,
		ClientSecret: envVars.ClientSecret,
		Scopes:       []string{"scim.invite"},
		TokenURL:     envVars.UAAURL + "/oauth/token",
	}

	return nil
}

func getRedisSettings(env *cfenv.App) (string, string, error) {
	uri, err := getRedisService(env)
	if err != nil {
		uri = os.Getenv("REDIS_URI")
	}
	if uri == "" {
		uri = "redis://localhost:6379"
	}

	u, err := url.Parse(uri)
	if err != nil {
		return "", "", err
	}

	password := ""
	if u.User != nil {
		password, _ = u.User.Password()
	}

	return u.Host, password, nil
}

func getRedisService(env *cfenv.App) (string, error) {
	if env == nil {
		return "", errors.New("Empty Cloud Foundry environment")
	}
	services, err := env.Services.WithTag("redis")
	if err != nil {
		return "", err
	}
	if len(services) == 0 {
		return "", errors.New(`Could not find service with tag "redis"`)
	}
	uri, ok := services[0].Credentials["uri"].(string)
	if !ok {
		if uri, err = getRedisURIFromParts(services[0]); err == nil {
			return uri, nil
		}
		return "", errors.New("Could not parse redis uri")
	}
	return uri, nil
}

// TODO: Delete after east-west is retired
func getRedisURIFromParts(service cfenv.Service) (string, error) {
	host, ok := service.Credentials["hostname"].(string)
	if !ok {
		return "", errors.New(`Could not find "host" key`)
	}

	port, ok := service.Credentials["port"].(string)
	if !ok {
		return "", errors.New(`Could not find "port" key`)
	}

	password, ok := service.Credentials["password"].(string)
	if !ok {
		return "", errors.New(`Could not find "password" key`)
	}

	return fmt.Sprintf("redis://:%s@%s:%s", password, host, port), nil
}
