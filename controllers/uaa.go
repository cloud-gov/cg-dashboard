package controllers

import (
	"bytes"
	"fmt"
	"io/ioutil"

	"encoding/json"

	"net/http"
	"net/http/httptest"

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
func (c *UAAContext) uaaProxy(rw http.ResponseWriter, req *web.Request,
	uaaEndpoint string, escalated bool) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	if escalated {
		c.PrivilegedProxy(rw, req.Request, reqURL)
	} else {
		c.Proxy(rw, req.Request, reqURL, c.GenericResponseHandler)
	}
}

// cfProxy is an esclated proxy that we want to use only with certain UAA calls.
func (c *UAAContext) cfProxy(rw http.ResponseWriter, req *http.Request,
	endpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.ConsoleAPI, endpoint)
	c.PrivilegedProxy(rw, req, reqURL)
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req, "/userinfo", false)
}

type inviteUAAUserResponse struct {
	NewInvites []newInvite `json:"new_invites"`
}
type newInvite struct {
	UserID     string `json:"userId"`
	Email      string `json:"email"`
	InviteLink string `json:"inviteLink"`
}
type createCFUser struct {
	GUID string `json:"guid"`
}

// InviteUsers will invite user and creating.
func (c *UAAContext) InviteUsers(rw web.ResponseWriter, req *web.Request) {
	// Make request to UAA to invite user (which will create the user in the
	// UAA database)
	reqURL := fmt.Sprintf("%s%s",
		"/invite_users?redirect_uri=", c.Settings.AppURL)
	// TODO should look into using reverseproxy in httputil.
	w := httptest.NewRecorder()
	c.uaaProxy(w, req, reqURL, true)
	if w.Code != http.StatusOK {
		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"unable to create user in UAA database.\", \"proxy-data\": \"" + string(body) + "\"}"))
	}
	resp := w.Result()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\"}"))
		return
	}

	// Read the response from inviting the user.
	var inviteResponse inviteUAAUserResponse
	err = json.Unmarshal(body, &inviteResponse)
	if err != nil {
		rw.WriteHeader(w.Code)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\"}"))
		return
	}

	// If we don't have a successful invite, we return an error.
	if len(inviteResponse.NewInvites) < 1 {
		rw.WriteHeader(w.Code)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"no successful invites created.\"}"))
		return
	}

	// Creating the JSON for the CF API request which will create the user in
	// CF database.
	cfCreateUserBody, err := json.Marshal(createCFUser{GUID: inviteResponse.NewInvites[0].Email})
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\"}"))
		return
	}

	// Send the request to the CF API to create the user in the CF database.
	cfReq, err := http.NewRequest("POST", "/v2/users",
		bytes.NewBuffer(cfCreateUserBody))
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"" + err.Error() + "\"}"))
		return
	}
	w = httptest.NewRecorder()
	c.cfProxy(w, cfReq, "/v2/users")
	if w.Code != http.StatusCreated {
		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{\"status\": \"failure\", \"data\": \"unable to create user in CF database.\", \"proxy-data\": \"" + string(body) + "\"}"))
	}

	// Trigger the e-mail invite.
	newInvite := inviteResponse.NewInvites[0]
	c.TriggerInvite(rw, inviteRequest{Email: newInvite.Email,
		InviteURL: newInvite.InviteLink,
		GUID:      newInvite.UserID,
	})
}

type inviteRequest struct {
	Email     string `json:"email"`
	InviteURL string `json:"inviteUrl"`
	GUID      string `json:"guid"`
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
	rw.Write([]byte("{\"status\": \"success\", \"email\": \"" + inviteReq.Email +
		"\", \"invite\": \"" + inviteReq.InviteURL +
		"\", \"guid\": \"" + inviteReq.GUID + "\"}"))
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
