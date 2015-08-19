package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/gocraft/web"
	"io/ioutil"
	"net/http"
	"net/url"
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
func (c *UAAContext) uaaPrivilegedProxy(rw web.ResponseWriter, req *http.Request, uaaEndpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	c.PrivilegedProxy(rw, req, reqURL)
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
// This function converts a POST request to a GET Request to prevent this:
// http://stackoverflow.com/questions/17303940/security-sending-email-address-in-a-url-parameter
// The payload of the POST request will be the filters to append to GET request.
// Basic format of payload
//	{
//		filter01: value01,
//		filter02, value02,
//		..
//		filterN, valueN
//	}
func (c *UAAContext) QueryUser(rw web.ResponseWriter, req *web.Request) {
	// Read JSON body of filters
	body, _ := ioutil.ReadAll(req.Body)
	// TODO check error.
	var filters map[string]string
	json.Unmarshal(body, &filters)

	// Make sure we never return all the results by default by requiring some filter(s).
	numOfFilters := len(filters)
	if numOfFilters < 1 {
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(rw, "{\"status\": \"error\", \"message\": \"not enough filters\"}")
		return
	}

	// Create basic query
	query := "/Users?attributes=id&attributes=userName&filter="
	filtersAdded := 0
	for filter, value := range filters {
		// TODO make sure there's no wildcard value.
		// TODO support other operators besides eq.
		query += url.QueryEscape(filter + " eq '" + value+"'")
		filtersAdded++
		if filtersAdded != numOfFilters {
			// TODO support more than just "and"
			query += url.QueryEscape(" and ")
		}
	}
	// Transform the POST request to a GET request by creating a new one.
	request, _ := http.NewRequest("GET", query, nil)
	c.uaaPrivilegedProxy(rw, request, query)
}
