package helpers

import (
	"crypto/tls"
	"encoding/gob"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/boj/redistore"
	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/sessions"
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
	// OpaqueUAATokens if set requests smaller opaque tokens from UAA
	OpaqueUAATokens bool
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
func (s *Settings) InitSettings(envVars *EnvVars, env *cfenv.App) (retErr error) {
	defer func() {
		// While .MustString() is convenient in readability below, we'd prefer to convert this
		// to an error for upstream callers.
		if r := recover(); r != nil {
			missingErr, ok := r.(*ErrMissingEnvVar)
			if !ok {
				// We don't know what this is, re-panic
				panic(r)
			}

			// Set return code to the actual error
			retErr = missingErr
		}
	}()

	s.BasePath = envVars.String(BasePathEnvVar, "")
	s.AppURL = envVars.MustString(HostnameEnvVar)
	s.ConsoleAPI = envVars.MustString(APIURLEnvVar)
	s.LoginURL = envVars.MustString(LoginURLEnvVar)
	s.UaaURL = envVars.MustString(UAAURLEnvVar)
	s.LogURL = envVars.MustString(LogURLEnvVar)
	s.PProfEnabled = envVars.Bool(PProfEnabledEnvVar)
	s.BuildInfo = envVars.String(BuildInfoEnvVar, "developer-build")
	s.LocalCF = envVars.Bool(LocalCFEnvVar)
	s.SecureCookies = envVars.Bool(SecureCookiesEnvVar)
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

	// Initialize CSRF key
	var err error
	// First, try the new env variable
	s.CSRFKey, err = hex.DecodeString(envVars.String(CSRFKeyEnvVar, ""))
	if err != nil {
		return err
	}

	// Fall back to legacy key variable and format - consider printing deprecation warning
	if len(s.CSRFKey) == 0 {
		s.CSRFKey = []byte(envVars.String(LegacySessionKeyEnvVar, ""))
		if len(s.CSRFKey) != 0 {
			log.Println("Warning: Use of deprecated SESSION_KEY. Please switch to CSRF_KEY (note new value is hex-encoded, see docs).")
		}
	}

	// Return error if not found
	if len(s.CSRFKey) == 0 {
		return &ErrMissingEnvVar{Name: CSRFKeyEnvVar}
	}

	// Initialize Sessions.
	// First, try the new env variable
	sessionAuthenticationKey, err := hex.DecodeString(envVars.String(SessionAuthenticationEnvVar, ""))
	if err != nil {
		return err
	}

	// Fall back to legacy key variable and format
	if len(sessionAuthenticationKey) == 0 {
		sessionAuthenticationKey = []byte(envVars.String(LegacySessionKeyEnvVar, ""))
		if len(sessionAuthenticationKey) != 0 {
			log.Println("Warning: Use of deprecated SESSION_KEY. Please switch to SESSION_AUTHENTICATION_KEY (note new value is hex-encoded, see docs).")
		}
	}

	// Return error if not found
	if len(sessionAuthenticationKey) == 0 {
		return &ErrMissingEnvVar{Name: SessionAuthenticationEnvVar}
	}

	switch envVars.String(SessionBackendEnvVar, "") {
	case "redis":
		address, password, err := getRedisSettings(env)
		if err != nil {
			return err
		}
		// Create a common redis pool of connections.
		redisPool := &redis.Pool{
			MaxIdle:     10,
			IdleTimeout: 240 * time.Second,
			TestOnBorrow: func(c redis.Conn, t time.Time) error {
				_, pingErr := c.Do("PING")
				return pingErr
			},
			Dial: func() (redis.Conn, error) {
				// We need to control how long connections are attempted.
				// Currently will limit how long redis should respond back to
				// 10 seconds. Any time less than the overall connection timeout of 60
				// seconds is good.
				c, dialErr := redis.Dial("tcp", address,
					redis.DialConnectTimeout(10*time.Second),
					redis.DialWriteTimeout(10*time.Second),
					redis.DialReadTimeout(10*time.Second))
				if dialErr != nil {
					return nil, dialErr
				}
				if password != "" {
					if _, authErr := c.Do("AUTH", password); err != nil {
						c.Close()
						return nil, authErr
					}
				}
				return c, nil
			},
		}
		// create our redis pool.
		store, err := redistore.NewRediStoreWithPool(redisPool, sessionAuthenticationKey)
		if err != nil {
			return err
		}
		store.SetMaxLength(4096 * 4)
		store.Options = &sessions.Options{
			HttpOnly: true,
			MaxAge:   expirationConstant,
			Path:     "/",
			Secure:   s.SecureCookies,
		}
		s.Sessions = store
		s.SessionBackend = "redis"

		// Use health check function where we do a PING.
		s.SessionBackendHealthCheck = func() bool {
			c := redisPool.Get()
			defer c.Close()
			_, err := c.Do("PING")
			if err != nil {
				log.Printf("{\"health-check-error\": \"%s\"}", err)
				return false
			}
			return true
		}
	default:
		store := sessions.NewFilesystemStore("", sessionAuthenticationKey)
		store.MaxLength(4096 * 4)
		store.Options = &sessions.Options{
			HttpOnly: true,
			// TODO remove this; work-around for
			// https://github.com/gorilla/sessions/issues/96
			MaxAge: expirationConstant,
			Path:   "/",
			Secure: s.SecureCookies,
		}
		s.Sessions = store
		s.SessionBackend = "file"
		s.SessionBackendHealthCheck = func() bool { return true }
	}

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
