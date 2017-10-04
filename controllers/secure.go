package controllers

import (
	"io"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
)

// SecureContext stores the session info and access token per user.
type SecureContext struct {
	*Context // Required.
	Token    oauth2.Token
}

// ResponseHandler is a type declaration for the function that will handle the response for the given request.
type ResponseHandler func(http.ResponseWriter, *http.Response)

// OAuth is a middle ware that checks whether or not the user has a valid token.
// If the token is present and still valid, it just passes it on.
// If the token is 1) present and expired or 2) not present, it will return unauthorized.
func (c *SecureContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
	// Get valid token if it exists from session store.
	if token := helpers.GetValidToken(req.Request, rw, c.Settings); token != nil {
		c.Token = *token
	} else {
		// If no token, return unauthorized.
		http.Error(rw, "{\"status\": \"unauthorized\"}", http.StatusUnauthorized)
		return
	}
	// Proceed to the next middleware or to the handler if last middleware.
	next(rw, req)
}

// LoginRequired is a middleware that requires a valid token or returns Unauthorized
func (c *SecureContext) LoginRequired(rw web.ResponseWriter, r *web.Request, next web.NextMiddlewareFunc) {

	// If there is no request just continue
	if r == nil {
		next(rw, r)
		return
	}

	// Don't cache anything
	// TODO: Come up with a better caching strategy. We should be able to to cache most API responses.
	rw.Header().Set("cache-control", "no-cache, no-store, must-revalidate, private")
	rw.Header().Set("pragma", "no-cache")
	rw.Header().Set("expires", "-1")

	token := helpers.GetValidToken(r.Request, rw, c.Settings)
	if token != nil {
		next(rw, r)
	} else {
		// Respond with Unauthorized, the client should detect this,
		// show appropriate messaging or redirect to login
		rw.WriteHeader(http.StatusUnauthorized)
	}
}

// PrivilegedProxy is an internal function that will construct the client using
// the credentials of the web app itself (not of the user) with the token in the headers and
// then sends a request.
func (c *SecureContext) PrivilegedProxy(rw http.ResponseWriter, req *http.Request, url string, responseHandler ResponseHandler) {
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.HighPrivilegedOauthConfig.Client(c.Settings.CreateContext())
	c.submitRequest(rw, req, url, client, responseHandler)
}

// Proxy is an internal function that will construct the client with the token in the headers and
// then send a request.
func (c *SecureContext) Proxy(rw http.ResponseWriter, req *http.Request, url string, responseHandler ResponseHandler) {
	// Acquire the http client and the refresh token if needed
	// https://godoc.org/golang.org/x/oauth2#Config.Client
	client := c.Settings.OAuthConfig.Client(c.Settings.CreateContext(), &c.Token)
	c.submitRequest(rw, req, url, client, responseHandler)
}

// submitRequest uses a given client and submits the specified request and
// closes the request and response bodies.
func (c *SecureContext) submitRequest(rw http.ResponseWriter, req *http.Request, url string, client *http.Client, responseHandler ResponseHandler) {
	// Prevents lingering goroutines from living forever.
	// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
	client.Timeout = 20 * time.Second
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
	// We need to transfer over the headers we want manually.
	// The UAA checks for it and will fail with a 415 Response Code if it is
	// missing during a POST request. (The CF API does not have this requirement).
	if contentHeader := req.Header.Get("Content-Type"); len(contentHeader) > 0 {
		request.Header.Set("Content-Type", contentHeader)
	}

	// Get RemoteAddr from the request
	if c.Settings.TICSecret != "" {
		clientIP, err := GetClientIP(req)
		if err != nil {
			log.Println(err)
			rw.WriteHeader(http.StatusInternalServerError)
			rw.Write([]byte("error parsing client ip"))
		}
		if clientIP != "" {
			// Set headers for requests to CF API proxy
			request.Header.Add("X-Client-IP", clientIP)
			request.Header.Add("X-TIC-Secret", c.Settings.TICSecret)
		}
	}

	request.Close = true
	// Send the request.
	res, err := client.Do(request)
	if res != nil {
		defer res.Body.Close()
	}
	if err != nil {
		log.Println(err)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("unknown error. try again"))
		return
	}
	// Should return the same status.
	rw.WriteHeader(res.StatusCode)
	responseHandler(rw, res)
}

// GenericResponseHandler is a normal handler for responses received from the proxy requests.
func (c *SecureContext) GenericResponseHandler(rw http.ResponseWriter, response *http.Response) {
	// Write the body into response that is going back to the frontend.
	_, err := io.Copy(rw, response.Body)
	if err != nil {
		log.Println(err)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("unknown error. try again"))
		return
	}
}

// GetClientIP gets a Client IP address from either X-Forwarded-For or RemoteAddr
func GetClientIP(req *http.Request) (string, error) {
	addrs := strings.Split(req.Header.Get("X-Forwarded-For"), ", ")
	for idx := len(addrs) - 1; idx >= 0; idx-- {
		if net.ParseIP(addrs[idx]).IsGlobalUnicast() {
			return addrs[idx], nil
		}
	}
	if req.RemoteAddr == "" {
		return "", nil
	}
	host, _, err := net.SplitHostPort(req.RemoteAddr)
	return host, err
}
