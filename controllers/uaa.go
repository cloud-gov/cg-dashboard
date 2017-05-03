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
func (c *UAAContext) uaaProxy(rw web.ResponseWriter, req *web.Request,
	uaaEndpoint string, escalated bool) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	if escalated {
		c.PrivilegedProxy(rw, req.Request, reqURL)
	} else {
		c.Proxy(rw, req.Request, reqURL, c.GenericResponseHandler)
	}
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req, "/userinfo", false)
}

// InviteUsers will invite user.
func (c *UAAContext) InviteUsers(rw web.ResponseWriter, req *web.Request) {
	reqURL := fmt.Sprintf("%s%s",
		"/invite_users?redirect_uri=", c.Settings.AppURL)
	c.uaaProxy(rw, req, reqURL, true)
}

// UaaInfo returns the UAA_API/Users/:id information for the logged in user.
func (c *UAAContext) UaaInfo(rw web.ResponseWriter, req *web.Request) {
	guid := req.URL.Query().Get("uaa_guid")
	if len(guid) > 0 {
		reqURL := fmt.Sprintf("%s%s", "/Users/", guid)
		c.uaaProxy(rw, req, reqURL, false)
	} else {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"Bad request\", \"error_description\": \"Missing valid guid.\"}"))
	}
}
