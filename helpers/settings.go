package helpers

import (
	"crypto/tls"
	"encoding/gob"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gorilla/sessions"
	"github.com/govau/cf-common/env"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

const (
	// 7 days at most.
	expirationConstant = 60 * 60 * 24 * 7
)

// Settings is the object to hold global values and objects for the service.
type Settings struct {
	// OAuthConfig is the OAuth client with all the parameters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Console API
	ConsoleAPI string
	// Login URL - used to redirect users to the logout page
	LoginURL string
	// Sessions is the session store for all connected users.
	Sessions sessions.Store
	// Generate secure random state
	StateGenerator func() (string, error)
	// UAA API
	UaaURL string
	// Log API
	LogURL string
	// TemplatesPath is the path to the templates directory.
	TemplatesPath string
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
	// Type of session backend
	SessionBackend string
	// Returns whether the backend is up.
	SessionBackendHealthCheck func() bool
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
	// CSRFKey used for gorilla CSRF validation
	CSRFKey []byte
}

// CreateContext returns a new context to be used for http connections.
func (s *Settings) CreateContext() context.Context {
	ctx := context.TODO()
	// If targeting local cf env, we won't have
	// valid SSL certs so we need to disable verifying them.
	if s.LocalCF {
		httpClient := http.DefaultClient
		httpClient.Transport = &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
		ctx = context.WithValue(ctx, oauth2.HTTPClient, httpClient)
	}
	return ctx
}

// InitSettings attempts to populate all the fields of the Settings struct. It will return an error if it fails,
// otherwise it returns nil for success.
func (s *Settings) InitSettings(envVars *env.VarSet, app *cfenv.App) (retErr error) {
	defer func() {
		// While .MustString() is convenient in readability below, we'd prefer
		// to convert this to an error for upstream callers.
		if r := recover(); r != nil {
			switch err := r.(type) {
			case error:
				if !env.IsVarNotFound(err) {
					panic(r)
				}
				// Set return code to the actual error
				retErr = err
			default:
				panic(r)
			}
		}
	}()

	s.TemplatesPath = envVars.String(TemplatesPathEnvVar, "./templates")
	s.AppURL = envVars.MustString(HostnameEnvVar)
	s.ConsoleAPI = envVars.MustString(APIURLEnvVar)
	s.LoginURL = envVars.MustString(LoginURLEnvVar)
	s.UaaURL = envVars.MustString(UAAURLEnvVar)
	s.LogURL = envVars.MustString(LogURLEnvVar)
	s.PProfEnabled = envVars.MustBool(PProfEnabledEnvVar)
	s.BuildInfo = envVars.String(BuildInfoEnvVar, "developer-build")
	s.LocalCF = envVars.MustBool(LocalCFEnvVar)
	s.SecureCookies = envVars.MustBool(SecureCookiesEnvVar)
	// Safe guard: shouldn't run with insecure cookies if we are
	// in a non-development environment (i.e. production)
	if s.LocalCF == false && s.SecureCookies == false {
		return errors.New("cannot run with insecure cookies when targeting a production CF environment")
	}

	// Setup OAuth2 Client Service.
	s.OAuthConfig = &oauth2.Config{
		ClientID:     envVars.MustString(ClientIDEnvVar),
		ClientSecret: envVars.MustString(ClientSecretEnvVar),
		RedirectURL:  s.AppURL + "/oauth2callback",
		Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  envVars.MustString(LoginURLEnvVar) + "/oauth/authorize",
			TokenURL: envVars.MustString(UAAURLEnvVar) + "/oauth/token",
		},
	}

	s.StateGenerator = func() (string, error) {
		return GenerateRandomString(32)
	}

	var err error

	// Initialize CSRF key
	s.CSRFKey, err = hex.DecodeString(envVars.MustString(CSRFKeyEnvVar))
	if err != nil {
		return fmt.Errorf("could not decode hex env var %q: %v", CSRFKeyEnvVar, err)
	}

	// Initialize Sessions.
	sessionAuthenticationKey, err := hex.DecodeString(envVars.MustString(SessionAuthenticationEnvVar))
	if err != nil {
		return fmt.Errorf("could not decode hex env var %q: %v", SessionAuthenticationEnvVar, err)
	}

	// Initialize cookiestore
	sessionEncryptionKey, err := hex.DecodeString(envVars.MustString(SessionEncryptionEnvVar))
	if err != nil {
		return err
	}
	store := sessions.NewCookieStore(sessionAuthenticationKey, sessionEncryptionKey)
	store.Options.HttpOnly = true
	store.Options.Secure = s.SecureCookies

	s.Sessions = store
	s.SessionBackend = "cookiestore"
	s.SessionBackendHealthCheck = func() bool { return true }

	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	s.HighPrivilegedOauthConfig = &clientcredentials.Config{
		ClientID:     envVars.MustString(ClientIDEnvVar),
		ClientSecret: envVars.MustString(ClientSecretEnvVar),
		Scopes:       []string{"scim.invite", "cloud_controller.admin", "scim.read"},
		TokenURL:     envVars.MustString(UAAURLEnvVar) + "/oauth/token",
	}

	s.SMTPFrom = envVars.MustString(SMTPFromEnvVar)
	s.SMTPHost = envVars.MustString(SMTPHostEnvVar)
	s.SMTPPass = envVars.String(SMTPPassEnvVar, "")
	s.SMTPPort = envVars.String(SMTPPortEnvVar, "")
	s.SMTPUser = envVars.String(SMTPUserEnvVar, "")
	s.TICSecret = envVars.String(TICSecretEnvVar, "")
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
	// If nothing worked so far, default to localhost
	if uri == "" || err != nil {
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
