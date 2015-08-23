package controllers

import (
	"fmt"
	"github.com/18F/cf-deck/helpers"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
	"io/ioutil"
	"net/http"
	"time"
)

// SecureContext stores the session info and access token per user.
type SecureContext struct {
	*Context // Required.
	Token    oauth2.Token
}

// OAuth is a middle ware that checks whether or not the user has a valid token.
// If the token is present and still valid, it just passes it on.
// If the token is 1) present and expired or 2) not present, it will return unauthorized.
func (c *SecureContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
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

// Proxy is an internal function that will construct the client with the token in the headers and
// then send a request.
func (c *SecureContext) Proxy(rw http.ResponseWriter, req *http.Request, url string) {
	// Make the request.
	request, _ := http.NewRequest(req.Method, url, req.Body)
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.OAuthConfig.Client(c.Settings.TokenContext, &c.Token)
	// Prevents lingering goroutines from living forever.
	// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
	client.Timeout = 3 * time.Second
	// Send the request.
	res, _ := client.Do(request)
	// Should return the same status.
	rw.WriteHeader(res.StatusCode)
	// Read the body.
	body, _ := ioutil.ReadAll(res.Body)
	defer res.Body.Close()
	// Write the body into response that is going back to the frontend.
	fmt.Fprintf(rw, string(body))
}
