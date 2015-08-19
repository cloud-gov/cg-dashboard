package controllers

import (
	"fmt"
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
	c.Proxy(rw, req.Request, reqURL)
}

// uaaPrivilegedProxy prepares the final URL to pass through the proxy with elevated privileges.
func (c *UAAContext) uaaPrivilegedProxy(rw web.ResponseWriter, req *web.Request, uaaEndpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	c.PrivilegedProxy(rw, req.Request, reqURL)
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req, "/userinfo")
}

/*
	By only looking for particular attributes, the response comes faster.
	Attributes to return:
	- id
	- meta
	- version (not helpful)
	- created
	- lastModified
	- userName
	- name
	- familyName
	- givenName
	- emails
	- groups (be careful, shows user scopes/ permissions)
*/

// QueryUser returns select data (id and userName) about all users.
// Additional information can be asked for by passing it view query string.
// Also, specific user(s) can be looked for by using the filter attribute.
// (eg: "?filter=id eq 'the-id'") spaces included
// More info about these filters can be found here:
// https://github.com/cloudfoundry/uaa/blob/master/docs/UAA-APIs.rst#query-for-information-get-users
func (c *UAAContext) QueryUser(rw web.ResponseWriter, req *web.Request) {
	c.uaaPrivilegedProxy(rw, req, "/Users?attributes=id&attributes=userName&"+req.URL.RawQuery)
}
