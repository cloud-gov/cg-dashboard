package controllers

import (
	"fmt"
  "net/http"
	"github.com/gocraft/web"
)

// UAAContext stores the session info and access token per user.
// All routes within UAAContext represent the routes to the UAA service.
type UAAContext struct {
	*SecureContext // Required.
}

// uaaProxy prepares the final URL to pass through the proxy.
func (c *UAAContext) uaaProxy(rw web.ResponseWriter, req *web.Request, uaaEndpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	c.Proxy(rw, req.Request, reqURL, c.GenericResponseHandler)
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req, "/userinfo")
}

// IsAdmin returns the UAA_API/users/:id information for the logged in user.
func (c *UAAContext) UaaInfo(rw web.ResponseWriter, req *web.Request) {
  guid := req.URL.Query().Get("uaa_guid");
  if len(guid) > 0 {
    reqURL := fmt.Sprintf("%s%s", "/Users/", guid)
    c.uaaProxy(rw, req, reqURL)
  } else {
    rw.WriteHeader(http.StatusBadRequest)
    rw.Write([]byte("{\"status\": \"Bad request\", \"error_description\": \"Missing valid guid.\"}"))
  }
}

