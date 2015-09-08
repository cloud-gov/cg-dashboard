package controllers

import (
	"fmt"
	"github.com/18F/cf-deck/helpers"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
	"io/ioutil"
	"net/http"
	"strings"
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
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.OAuthConfig.Client(c.Settings.TokenContext, &c.Token)
	c.submitRequest(rw, req, url, client)
}

// PrivilegedProxy is an internal function that will construct the client using
// the credentials of the web app itself (not of the user) with the token in the headers and
// then sends a request.
func (c *SecureContext) PrivilegedProxy(rw http.ResponseWriter, req *http.Request, url string) {
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.HighPrivilegedOauthConfig.Client(c.Settings.TokenContext)
	c.submitRequest(rw, req, url, client)

}

// submitRequest uses a given client and submits the specified request.
func (c *SecureContext) submitRequest(rw http.ResponseWriter, req *http.Request, url string, client *http.Client) {
	// Prevents lingering goroutines from living forever.
	// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
	client.Timeout = 5 * time.Second
	// In case the body is not of io.Closer.
	if req.Body != nil {
		defer req.Body.Close()
	}
	req.Close = true
	// Make a new request.
	request, _ := http.NewRequest(req.Method, url, req.Body)
	// In case the body is not of io.Closer.
	if request.Body != nil {
		defer request.Body.Close()
	}
	request.Close = true
	// Send the request.
	res, err := client.Do(request)
	if res != nil {
		defer res.Body.Close()
	}
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(rw, "unknown error. try again")
		return
	}
	// Should return the same status.
	rw.WriteHeader(res.StatusCode)
	contentType := res.Header.Get("Content-Type")
	if strings.HasPrefix(contentType, "multipart/") {
		messages, err := helpers.ParseLogMessages(&res.Body, contentType)
		if err != nil {
			fmt.Fprintf(rw, err.Error())
		}
		fmt.Fprintf(rw, messages.String())
		return
	}
	// Read the body.
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(rw, "unknown error. try again")
		return
	}

	// Write the body into response that is going back to the frontend.
	fmt.Fprintf(rw, string(body))
}
