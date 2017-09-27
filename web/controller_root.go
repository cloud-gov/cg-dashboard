package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/18F/cg-dashboard/internal/mailer"
	"github.com/18F/cg-dashboard/internal/random"
	"github.com/18F/cg-dashboard/internal/sessions"
	"github.com/18F/cg-dashboard/internal/templates"
	"github.com/gocraft/web"
	"github.com/gorilla/csrf"
	"golang.org/x/oauth2"
)

// Context represents the context for all requests that do not need authentication.
type Context struct {
	templates    *templates.Templates
	mailer       mailer.Mailer
	constants    constants
	sessionStore sessions.Store
	cf           *cf
}

// StaticMiddleware provides simple caching middleware for static assets.
func StaticMiddleware(path string) func(web.ResponseWriter, *web.Request, web.NextMiddlewareFunc) {
	staticMiddleware := web.StaticMiddleware(path)
	return func(rw web.ResponseWriter, r *web.Request, next web.NextMiddlewareFunc) {
		// We want clients to cache these assets but it's important that they are
		// up to date. If the javascript bundle does not match the server API,
		// undefined behavior could happen.
		rw.Header().Set("Cache-Control", "public, must-revalidate")
		staticMiddleware(rw, r, next)
	}
}

// Index serves index.html
func (c *Context) Index(w web.ResponseWriter, r *web.Request) {
	c.templates.GetIndex(w,
		csrf.Token(r.Request),
		os.Getenv("GA_TRACKING_ID"),
		os.Getenv("NEW_RELIC_ID"),
		os.Getenv("NEW_RELIC_BROWSER_LICENSE_KEY"))
}

type pingData struct {
	SystemHealthy      bool                 `json:"system-healthy"`
	BuildInfo          string               `json:"build-info"`
	SessionStoreHealth sessionStorePingData `json:"session-store-health"`
}
type sessionStorePingData struct {
	StoreType string `json:"store-type"`
	StoreUp   bool   `json:"store-up"`
}

func createPingData(c *Context) (pingData, bool) {
	sessionBackendService := c.sessionStore.GetBackendService()
	storeUp := sessionBackendService.HealthCheck()
	overallStatus := true
	// if the session storage is out, we have an outage.
	if !storeUp {
		overallStatus = false
	}
	return pingData{SystemHealthy: overallStatus,
		BuildInfo: c.constants.buildInfo,
		SessionStoreHealth: sessionStorePingData{
			StoreType: sessionBackendService.Type(),
			StoreUp:   storeUp,
		},
	}, overallStatus
}

// Ping is just a test endpoint to show that indeed the service is alive.
func (c *Context) Ping(rw web.ResponseWriter, req *web.Request) {
	data, isHealthy := createPingData(c)
	if !isHealthy {
		rw.WriteHeader(http.StatusInternalServerError)
		// Also, should log out the data in the case of error so we can look at logs
		// later to see what's wrong.
		log.Printf("%+v\n", data)
	}
	json.NewEncoder(rw).Encode(data)
}

// LoginHandshake is the handler where we authenticate the user and the user authorizes this application access to information.
func (c *Context) LoginHandshake(rw web.ResponseWriter, req *web.Request) {
	if token := GetValidToken(req.Request, c.sessionStore, c.cf.apiURL,
		c.cf.oAuthConfig, c.constants.skipSSLValidation); token != nil {
		// We should just go to dashboard if the user already has a valid token.
		dashboardURL := fmt.Sprintf("%s%s", c.cf.appURL, "/#/dashboard")
		http.Redirect(rw, req.Request, dashboardURL, http.StatusFound)

	} else {
		// Redirect to the Cloud Foundry Login place.
		err := c.redirect(rw, req)
		if err != nil {
			fmt.Println("Error on oauth redirect: ", err.Error())
		}
	}
}

// OAuthCallback is the function that is called when the UAA provider uses the "redirect_uri" field to call back to this backend.
// This function will extract the code, get the access token and refresh token and save it into 1) the session and redirect to the
// frontend dashboard.
func (c *Context) OAuthCallback(rw web.ResponseWriter, req *web.Request) {
	code := req.URL.Query().Get("code")
	state := req.URL.Query().Get("state")

	if len(code) < 1 {
		// TODO: error.
	}

	// Ignore error, Get will return a session, existing or new.
	session, _ := c.sessionStore.Get(req.Request, "session")

	if state == "" || state != session.Values["state"] {
		rw.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Exchange the code for a token.
	token, err := c.cf.oAuthConfig.Exchange(CreateContext(c.constants.skipSSLValidation), code)
	if err != nil {
		fmt.Println("Unable to get access token from code " + code + " error " + err.Error())
		return
		// TODO: Handle. Return 500.
	}

	session.Values["token"] = *token
	delete(session.Values, "state")

	// Save session.
	err = session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}

	// Redirect to the dashboard.
	dashboardURL := fmt.Sprintf("%s%s", c.cf.appURL, "/#/dashboard")
	http.Redirect(rw, req.Request, dashboardURL, http.StatusFound)
	// TODO. Redirect to the original route.
}

// Logout is a handler that will attempt to clear the session information for the current user.
func (c *Context) Logout(rw web.ResponseWriter, req *web.Request) {
	session, _ := c.sessionStore.Get(req.Request, "session")
	// Clear the token
	session.Values["token"] = nil
	// Force the session to expire
	session.Options.MaxAge = -1
	session.Save(req.Request, rw)
	logoutURL := fmt.Sprintf("%s%s", c.cf.endpoint.AuthEndpoint, "/logout.do")
	http.Redirect(rw, req.Request, logoutURL, http.StatusFound)
}

func (c *Context) redirect(rw web.ResponseWriter, req *web.Request) error {
	session, _ := c.sessionStore.Get(req.Request, "session")
	state, err := random.GenerateString(32)
	if err != nil {
		return err
	}

	session.Values["state"] = state
	err = session.Save(req.Request, rw)
	if err != nil {
		return err
	}

	http.Redirect(rw, req.Request, c.cf.oAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOnline), http.StatusFound)

	return nil
}

// GetValidToken is a helper function that returns a token struct only if it finds a non expired token for the session.
func (c *Context) GetValidToken(req *http.Request) *oauth2.Token {
	// Get session from session store.
	session, err := c.sessionStore.Get(req, "session")
	// If for some reason we can't get or create a session, bail out.
	if session == nil || err != nil {
		return nil
	}

	// Attempt to get the token from this session.
	if token, ok := session.Values["token"].(oauth2.Token); ok {
		// If valid, just return.
		if token.Valid() {
			return &token
		}

		// Attempt to refresh token using oauth2 Client
		// https://godoc.org/golang.org/x/oauth2#Config.Client
		reqURL := fmt.Sprintf("%s%s", apiURL, "/v2/info")
		request, _ := http.NewRequest("GET", reqURL, nil)
		request.Close = true
		client := c.cf.oAuthConfig.Client(
			CreateContext(c.constants.skipSSLValidation), &token)
		// Prevents lingering goroutines from living forever.
		// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
		client.Timeout = TimeoutConstant
		resp, err := client.Do(request)
		if resp != nil {
			defer resp.Body.Close()
		}
		if err != nil {
			return nil
		}
		return &token
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}
