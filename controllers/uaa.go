package controllers

import (
	"bytes"
	"fmt"

	"encoding/json"

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

type inviteRequest struct {
	Email     string `json:"email"`
	InviteURL string `json:"inviteUrl"`
}

// SendInvite sends users an email with a link to the UAA invite
func (c *UAAContext) SendInvite(rw web.ResponseWriter, req *web.Request) {
	rw.Header().Set("Content-Type", "application/json; charset=utf-8")
	if req.Body == nil {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"No request body found.\"}"))
		return
	}
	decoder := json.NewDecoder(req.Body)
	var inviteReq inviteRequest
	err := decoder.Decode(&inviteReq)
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\"}"))
		return
	}
	defer req.Body.Close()
	c.TriggerInvite(rw, inviteReq)
}

// TriggerInvite trigger the email to be send for SendInvite
func (c *UAAContext) TriggerInvite(rw web.ResponseWriter, inviteReq inviteRequest) {
	if inviteReq.Email == "" || inviteReq.InviteURL == "" {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"Missing correct params.\"}"))
		return
	}
	emailHTML := new(bytes.Buffer)
	err := c.templates.GetInviteEmail(emailHTML, inviteReq.InviteURL)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\" }"))
		return
	}
	err = c.mailer.SendEmail(inviteReq.Email, "Invitation to join cloud.gov", emailHTML.Bytes())
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\" }"))
		return
	}
	rw.Write([]byte("{\"status\": \"success\", \"email\": \"" + inviteReq.Email + "\", \"invite\": \"" + inviteReq.InviteURL + "\" }"))
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
