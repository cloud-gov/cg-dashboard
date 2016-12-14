package controllers

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/gocraft/web"
	"github.com/gorilla/csrf"
	"golang.org/x/oauth2"
)

// Context represents the context for all requests that do not need authentication.
type Context struct {
	Settings  *helpers.Settings
	templates *template.Template
}

// Index serves index.html
func (c *Context) Index(w web.ResponseWriter, r *web.Request) {
	c.templates.ExecuteTemplate(w, "index.html", map[string]interface{}{
		"csrfToken": csrf.Token(r.Request),
	})
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
	token, err := c.Settings.OAuthConfig.Exchange(oauth2.NoContext, code)
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
	http.Redirect(rw, req.Request, "/#/dashboard", http.StatusFound)
	// TODO. Redirect to the original route.
}

// LoginRequired is a middleware that requires a valid toker or redirects to the handshake page.
func (c *Context) LoginRequired(rw web.ResponseWriter, r *web.Request, next web.NextMiddlewareFunc) {

	// If there is no request just continue
	if r == nil {
		next(rw, r)
		return
	}

	// Don't cache anything
	// right now, there's a problem where when you initially logout and then
	// revisit the server, you will get a bad view due to a caching issue.
	// for now, we clear the cache for everything.
	// TODO: revist and cache static assets.
	rw.Header().Set("cache-control", "no-cache, no-store, must-revalidate, private")
	rw.Header().Set("pragma", "no-cache")
	rw.Header().Set("expires", "-1")

	token := helpers.GetValidToken(r.Request, c.Settings)
	tokenPresent := token != nil
	publicUrls := map[string]struct{}{
		"/handshake":      {},
		"/oauth2callback": {},
		"/ping":           {},
		"/assets/img/dashboard-uaa-icon.jpg": {},
	}
	// Check if URL is public so we skip validation
	_, public := publicUrls[r.URL.EscapedPath()]
	if public || tokenPresent {
		next(rw, r)
	} else {
		err := c.redirect(rw, r)
		if err != nil {
			fmt.Println("Error on oauth redirect: ", err.Error())
		}
	}
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
