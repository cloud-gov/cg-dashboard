package main

import (
	"fmt"

	"github.com/gocraft/web"
)

// APIContext stores the session info and access token per user.
// All routes within APIContext represent the API routes
type APIContext struct {
	*SecureContext // Required.
}

// APIProxy is a handler that serves as a proxy for all the CF API. Any route that comes in the /v2/* route
// that has not been specified, will just come here.
func (c *APIContext) APIProxy(rw web.ResponseWriter, req *web.Request) {
	reqURL := fmt.Sprintf("%s%s", c.cf.apiURL, req.URL)
	c.Proxy(rw, req.Request, reqURL, c.GenericResponseHandler)
}

// AuthStatus simply returns authorized. This endpoint is just a quick endpoint to indicate that if a
// user can reach here after passing through the OAuth Middleware, they are authorized.
func (c *APIContext) AuthStatus(rw web.ResponseWriter, req *web.Request) {
	rw.Write([]byte("{\"status\": \"authorized\"}"))
}
