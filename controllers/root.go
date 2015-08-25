package controllers

import (
	"fmt"
	"github.com/18F/cg-deck/helpers"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
	"net/http"
)

// Context represents the context for all requests that do not need authentication.
type Context struct {
	Settings *helpers.Settings
}

// Ping is just a test endpoint to show that indeed the service is alive.
// TODO. Remove.
func (c *Context) Ping(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "{\"status\": \"alive\", \"build-info\": \""+c.Settings.BuildInfo+"\"}")
}

// LoginHandshake is the handler where we authenticate the user and the user authorizes this application access to information.
func (c *Context) LoginHandshake(rw web.ResponseWriter, req *web.Request) {
	if token := helpers.GetValidToken(req.Request, c.Settings); token != nil {
		// We should just go to dashboard if the user already has a valid token.
		http.Redirect(rw, req.Request, "/#/dashboard", http.StatusFound)

	} else {
		// Redirect to the Cloud Foundry Login place.
		http.Redirect(rw, req.Request, c.Settings.OAuthConfig.AuthCodeURL("state", oauth2.AccessTypeOnline), http.StatusFound)
	}
}

// OAuthCallback is the function that is called when the UAA provider uses the "redirect_uri" field to call back to this backend.
// This funciton will extract the code, get the access token and refresh token and save it into 1) the session and redirect to the
// frontend dashboard.
func (c *Context) OAuthCallback(rw web.ResponseWriter, req *web.Request) {
	code := req.URL.Query().Get("code")

	if len(code) < 1 {
		// TODO: error.
	}

	// Exchange the code for a token.
	token, err := c.Settings.OAuthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		fmt.Println("Unable to get access token from code " + code + " error " + err.Error())
		return
		// TODO: Handle. Return 500.
	}

	// Ignore error, Get will return a session, existing or new.
	session, _ := c.Settings.Sessions.Get(req.Request, "session")
	session.Values["token"] = *token

	// Save session.
	err = session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}

	// Redirect to the dashboard.
	http.Redirect(rw, req.Request, "/#/dashboard", http.StatusFound)
	// TODO. Redirect to the original route.
}

// LoginRequired is a middleware that requires a valid toker or redirects to the handshake page.
func (c *Context) LoginRequired(rw web.ResponseWriter, r *web.Request, next web.NextMiddlewareFunc) {
	// If there is no request just continue
	if r != nil {
		next(rw, r)
		return
	}

	token := helpers.GetValidToken(r.Request, c.Settings)
	public_urls := map[string]struct{}{
		"/handshake":      {},
		"/oauth2callback": {},
		"/ping":           {},
	}
	// Check if URL is public so we skip validation
	_, ok := public_urls[r.URL.EscapedPath()]

	if ok || token != nil {
		next(rw, r)
	} else {
		rw.Header().Set("Location", "/handshake")
		rw.WriteHeader(http.StatusMovedPermanently)
	}
}
