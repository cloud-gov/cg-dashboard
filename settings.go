package main

import (
	"encoding/gob"
	"errors"
	"net/url"
	"os"

	"github.com/18F/cg-dashboard/internal/services/fileservice"
	"github.com/18F/cg-dashboard/internal/services/redisservice"
	"github.com/18F/cg-dashboard/internal/sessions"
	"github.com/18F/cg-dashboard/internal/sessions/filesession"
	"github.com/18F/cg-dashboard/internal/sessions/redissession"
	cfclient "github.com/cloudfoundry-community/go-cfclient"
	"github.com/cloudfoundry-community/go-cfenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

// Settings is the object to hold global values and objects for the service.
type Settings struct {
	// OAuthConfig is the OAuth client with all the parameters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Console API
	ConsoleAPI string
	// Endpoint Info
	Endpoint cfclient.Endpoint
	// Sessions is the session store for all connected users.
	Sessions sessions.Store
	// Path to root of project.
	BasePath string
	// High Privileged OauthConfig
	HighPrivilegedOauthConfig *clientcredentials.Config
	// A flag to indicate whether profiling should be included (debug purposes).
	PProfEnabled bool
	// Build Info
	BuildInfo string
	// Set the secure flag on session cookies
	SecureCookies bool
	// Inidicates if targeting a local CF environment.
	LocalCF bool
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
	// Shared secret with CF API proxy
	TICSecret string
}

// InitSettings attempts to populate all the fields of the Settings struct. It will return an error if it fails,
// otherwise it returns nil for success.
func (s *Settings) InitSettings(envVars EnvVars, env *cfenv.App, endpoint cfclient.Endpoint) error {
	s.EndpointInfo = endpoint
	// Setup OAuth2 Client Service.
	s.OAuthConfig = &oauth2.Config{
		ClientID:     envVars.ClientID,
		ClientSecret: envVars.ClientSecret,
		RedirectURL:  s.AppURL + "/oauth2callback",
		Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  s.EndpointInfo.AuthEndpoint + "/oauth/authorize",
			TokenURL: s.EndpointInfo.TokenEndpoint + "/oauth/token",
		},
	}

	// Initialize Sessions.
	switch envVars.SessionBackend {
	case "redis":
		address, password, err := getRedisSettings(env)
		if err != nil {
			return err
		}
		redisService := redisservice.Init(address, password)
		// create our redis pool.
		store, err := redissession.Init(redisService,
			envVars.SessionKey, s.SecureCookies)
		if err != nil {
			return err
		}
		s.Sessions = store
	default:
		s.Sessions = filesession.Init(fileservice.FileSystemService{},
			envVars.SessionKey, s.SecureCookies)
	}

	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	s.HighPrivilegedOauthConfig = &clientcredentials.Config{
		ClientID:     envVars.ClientID,
		ClientSecret: envVars.ClientSecret,
		Scopes:       []string{"scim.invite", "cloud_controller.admin", "scim.read"},
		TokenURL:     s.EndpointInfo.TokenEndpoint + "/oauth/token",
	}

	s.SMTPFrom = envVars.SMTPFrom
	s.SMTPHost = envVars.SMTPHost
	s.SMTPPass = envVars.SMTPPass
	s.SMTPPort = envVars.SMTPPort
	s.SMTPUser = envVars.SMTPUser
	s.TICSecret = envVars.TICSecret
	return nil
}

func getRedisSettings(env *cfenv.App) (string, string, error) {
	var err error
	// Try to read directly from REDIS_URI first.
	uri := os.Getenv("REDIS_URI")
	if uri == "" {
		// If no direct REDIS_URI, parse VCAP_SERVICES
		uri, err = getRedisService(env)
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
		return "", errors.New(`Could not find "uri" in redis service`)
	}
	return uri, nil
}
