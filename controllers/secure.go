package controllers

import (
	"fmt"
	"github.com/18F/cg-dashboard/helpers"
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

// ResponseHandler is a type declaration for the function that will handle the response for the given request.
type ResponseHandler func(*http.ResponseWriter, *http.Response)

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
func (c *SecureContext) Proxy(rw http.ResponseWriter, req *http.Request, url string, responseHandler ResponseHandler) {
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.OAuthConfig.Client(c.Settings.TokenContext, &c.Token)
	c.submitRequest(rw, req, url, client, responseHandler)
}

// submitRequest uses a given client and submits the specified request.
func (c *SecureContext) submitRequest(rw http.ResponseWriter, req *http.Request, url string, client *http.Client, responseHandler ResponseHandler) {
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
	responseHandler(&rw, res)
}

// GenericResponseHandler is a normal handler for responses received from the proxy requests.
func (c *SecureContext) GenericResponseHandler(rw *http.ResponseWriter, response *http.Response) {
	// Read the body.
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		(*rw).WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(*rw, "unknown error. try again")
		return
	}

	// Write the body into response that is going back to the frontend.
	fmt.Fprintf(*rw, string(body))
}
