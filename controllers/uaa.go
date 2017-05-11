package controllers

import (
	"fmt"
	"log"

	"github.com/bitly/go-simplejson"
	"io/ioutil"
	"net/http"

	"github.com/gocraft/web"
)

// UAAContext stores the session info and access token per user.
// All routes within UAAContext represent the routes to the UAA service.
type UAAContext struct {
	*SecureContext // Required.
}

// uaaProxy prepares the final URL to pass through the proxy.
// By setting "escalated" to true, you can use the Dashboard's credentials to
// make the request instead of the current user's credentials.
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

// SendInvite sends users an email with a link to the UAA invite
func (c *UAAContext) SendInvite(rw web.ResponseWriter, req *web.Request) {
	body, err := ioutil.ReadAll(req.Body)
	js, err := simplejson.NewJson(body)
	email := js.Get("email").MustString()
	inviteURL := js.Get("invite_url").MustString()
	if err != nil {
		log.Fatalln(err)
	}
	if email == "" || inviteURL == "" {
		rw.Header().Set("Content-Type", "application/json; charset=utf-8")
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"Missing correct params.\"}"))
		return
	}
	c.TriggerInvite(rw, email, inviteURL)
}

// TriggerInvite trigger the email to be send for SendInvite
func (c *UAAContext) TriggerInvite(rw web.ResponseWriter, email string, inviteURL string) {
	errEmail := c.mailer.SendInviteEmail(email, inviteURL)
	if errEmail != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + errEmail.Error() + "\" }"))
		return
	}
	rw.Header().Set("Content-Type", "application/json; charset=utf-8")
	rw.Write([]byte("{\"status\": \"success\", \"email\": \"" + email + "\", \"invite\": \"" + inviteURL + "\" }"))
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
