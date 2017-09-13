package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/mailer"
	"github.com/gocraft/web"
	"github.com/gorilla/csrf"
	"golang.org/x/oauth2"
)

// Context represents the context for all requests that do not need authentication.
type Context struct {
	Settings  *helpers.Settings
	templates *helpers.Templates
	mailer    mailer.Mailer
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
	Status             string             `json:"status"`
	BuildInfo          string             `json:"build-info"`
	SessionStoreHealth sessionStoreHealth `json:"session-store-health"`
}

const (
	pingDataStatusAlive  = "alive"
	pingDataStatusOutage = "outage"
)

func (p pingData) isSystemHealthy() bool {
	return p.Status == pingDataStatusAlive
}

// toJSON returns a json representation of the pingData.
// if it fails to return something, it will return an error in JSON.
// also returns a boolean determining if the call succeeded.
func (p pingData) toJSON() ([]byte, bool) {
	pingBody, err := json.Marshal(p)
	// Would only ever come up when adding new fields to pingData and it
	// wasn't tested properly. This will only happen when trying to marshal things
	// that don't result in proper JSON.
	if err != nil {
		return []byte("\"status\": \"error\": \"data\": \"" + err.Error() + "\""),
			false
	}
	return pingBody, true
}

type sessionStoreHealth struct {
	StoreType string `json:"store-type"`
	StoreUp   bool   `json:"store-up"`
}

func createPingData(c *Context) pingData {
	storeUp := c.Settings.SessionBackendHealthCheck()
	overallStatus := pingDataStatusAlive
	// if the session storage is out, we have an outage.
	if !storeUp {
		overallStatus = pingDataStatusOutage
	}
	return pingData{Status: overallStatus,
		BuildInfo: c.Settings.BuildInfo,
		SessionStoreHealth: sessionStoreHealth{
			StoreType: c.Settings.SessionBackend,
			StoreUp:   storeUp,
		},
	}
}

// Ping is just a test endpoint to show that indeed the service is alive.
func (c *Context) Ping(rw web.ResponseWriter, req *web.Request) {
	data := createPingData(c)
	dataJSON, conversionSuccess := data.toJSON()
	if !data.isSystemHealthy() || !conversionSuccess {
		rw.WriteHeader(http.StatusInternalServerError)
		// Also, should log out the data in the case of error so we can look at logs
		// later to see what's wrong.
		log.Println(string(dataJSON))
	}
	rw.Write(dataJSON)
}

// LoginHandshake is the handler where we authenticate the user and the user authorizes this application access to information.
func (c *Context) LoginHandshake(rw web.ResponseWriter, req *web.Request) {
	if token := helpers.GetValidToken(req.Request, c.Settings); token != nil {
		// We should just go to dashboard if the user already has a valid token.
		dashboardURL := fmt.Sprintf("%s%s", c.Settings.AppURL, "/#/dashboard")
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
	session, _ := c.Settings.Sessions.Get(req.Request, "session")

	if state == "" || state != session.Values["state"] {
		rw.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Exchange the code for a token.
	token, err := c.Settings.OAuthConfig.Exchange(c.Settings.CreateContext(), code)
	if err != nil {
		fmt.Println("Unable to get access token from code " + code + " error " + err.Error())
		return
		// TODO: Handle. Return 500.
	}

	// Drop refresh token because we can't it in session. TODO Fix!!!
	token.RefreshToken = "" // in theory if we use opaque tokens, we'd be small enough. but CC controller doesn't support yet
	session.Values["token"] = *token
	delete(session.Values, "state")

	// Save session.
	err = session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}

	// Redirect to the dashboard.
	dashboardURL := fmt.Sprintf("%s%s", c.Settings.AppURL, "/#/dashboard")
	http.Redirect(rw, req.Request, dashboardURL, http.StatusFound)
	// TODO. Redirect to the original route.
}

// Logout is a handler that will attempt to clear the session information for the current user.
func (c *Context) Logout(rw web.ResponseWriter, req *web.Request) {
	session, _ := c.Settings.Sessions.Get(req.Request, "session")
	// Clear the token
	session.Values["token"] = nil
	// Force the session to expire
	session.Options.MaxAge = -1
	session.Save(req.Request, rw)
	logoutURL := fmt.Sprintf("%s%s", c.Settings.LoginURL, "/logout.do")
	http.Redirect(rw, req.Request, logoutURL, http.StatusFound)
}

func (c *Context) redirect(rw web.ResponseWriter, req *web.Request) error {
	session, _ := c.Settings.Sessions.Get(req.Request, "session")
	state, err := c.Settings.StateGenerator()
	if err != nil {
		return err
	}

	session.Values["state"] = state
	err = session.Save(req.Request, rw)
	if err != nil {
		return err
	}

	http.Redirect(rw, req.Request, c.Settings.OAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOnline), http.StatusFound)

	return nil
}
