package controllers

import (
	"fmt"
	"github.com/18F/cf-console/helpers"
	"github.com/gocraft/web"
	"io/ioutil"
	"net/http"
)

// APIContext stores the session info and access token per user.
// All routes within APIContext represent the API routes
type APIContext struct {
	*Context    // Required.
	AccessToken string
}

// OAuth is a middle ware that checks whether or not the user has a valid token.
// If the token is present and still valid, it just passes it on.
// If the token is 1) present and expired or 2) not present, it will return unauthorized.
func (c *APIContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
	// Get valid token if it exists from session store.
	if token := helpers.GetValidToken(req.Request, c.Settings); token != nil {
		c.AccessToken = token.AccessToken
	} else {
		// If no token, return unauthorized.
		http.Error(rw, "{\"status\": \"unauthorized\"}", http.StatusUnauthorized)
		return
	}
	// Proceed to the next middleware or to the handler if last middleware.
	next(rw, req)
}

// A Proxy for all CF API
func (c *APIContext) Proxy(rw web.ResponseWriter, req *web.Request) {

	req_url := fmt.Sprintf("%s%s", c.Settings.ConsoleAPI, req.URL.Path)
	fmt.Println(req_url)
	request, _ := http.NewRequest("GET", req_url, nil)
	request.Header.Set("authorization", fmt.Sprintf("bearer %s", c.AccessToken))
	client := &http.Client{}
	res, _ := client.Do(request)
	body, _ := ioutil.ReadAll(res.Body)
	defer res.Body.Close()
	fmt.Fprintf(rw, string(body))
}
