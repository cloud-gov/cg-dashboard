package controllers

import (
	"fmt"
	"github.com/18F/cf-console/helpers"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
	"io/ioutil"
	"net/http"
)

// APIContext stores the session info and access token per user.
// All routes within APIContext represent the API routes
type APIContext struct {
	*Context // Required.
	Token    oauth2.Token
}

// OAuth is a middle ware that checks whether or not the user has a valid token.
// If the token is present and still valid, it just passes it on.
// If the token is 1) present and expired or 2) not present, it will return unauthorized.
func (c *APIContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
	// Get valid token if it exists from session store.

	if token := helpers.GetValidToken(req.Request, c.Settings); token != nil {
		c.Token = *token
	} else {
		// If no token, return unauthorized.
		http.Error(rw, "{\"status\": \"unauthorized\"}", http.StatusUnauthorized)
		return
	}
	// Proceed to the next middleware or to the handler if last middleware.
	next(rw, req)
}

// Proxy is a handler that serves as a proxy for all the CF API. Any route that comes in the /v2/* route
// that has not been specified, will just come here.
func (c *APIContext) Proxy(rw web.ResponseWriter, req *web.Request) {

	// Get client and refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	reqURL := fmt.Sprintf("%s%s", c.Settings.ConsoleAPI, req.URL.Path)
	request, _ := http.NewRequest("GET", reqURL, nil)
	client := c.Settings.OAuthConfig.Client(c.Settings.TokenContext, &c.Token)
	res, _ := client.Do(request)
	body, _ := ioutil.ReadAll(res.Body)
	defer res.Body.Close()
	fmt.Fprintf(rw, string(body))
}

// Logout is a handler that will attempt to clear the session information for the current user.
func (c *APIContext) Logout(rw web.ResponseWriter, req *web.Request) {
	session, _ := c.Settings.Sessions.Get(req.Request, "session")
	// Clear the token
	session.Values["token"] = nil
	// Force the session to expire
	session.Options.MaxAge = -1
	err := session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}
	logoutURL := fmt.Sprintf("%s%s", c.Settings.LoginURL, "/logout.do")
	http.Redirect(rw, req.Request, logoutURL, http.StatusFound)
}

// UserProfile redirects users to the `/profile` page
func (c *APIContext) UserProfile(rw web.ResponseWriter, req *web.Request) {
	profileURL := fmt.Sprintf("%s%s", c.Settings.LoginURL, "/profile")
	http.Redirect(rw, req.Request, profileURL, http.StatusFound)
}

// AuthStatus simply returns authorized. This endpoint is just a quick endpoint to indicate that if a
// user can reach here after passing through the OAuth Middleware, they are authorized.
func (c *APIContext) AuthStatus(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "{\"status\": \"authorized\"}")
}
