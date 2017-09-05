package controllers

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"

	"encoding/json"

	"net/http"
	"net/http/httptest"
	"net/url"

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
func (c *UAAContext) uaaProxy(rw http.ResponseWriter, req *http.Request,
	uaaEndpoint string, escalated bool) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	if escalated {
		c.PrivilegedProxy(rw, req, reqURL, c.GenericResponseHandler)
	} else {
		c.Proxy(rw, req, reqURL, c.GenericResponseHandler)
	}
}

// cfProxy is an esclated proxy that we want to use only with certain UAA calls.
func (c *UAAContext) cfProxy(rw http.ResponseWriter, req *http.Request,
	endpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.ConsoleAPI, endpoint)
	c.PrivilegedProxy(rw, req, reqURL, c.GenericResponseHandler)
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req.Request, "/userinfo", false)
}

func readBodyToStruct(rawBody io.ReadCloser, obj interface{}) (err *UaaError) {
	if rawBody == nil {
		err = &UaaError{http.StatusBadRequest,
			[]byte("{\"status\": \"failure\", \"data\": \"no body in request.\"}")}
		return
	}
	defer rawBody.Close()
	body, readErr := ioutil.ReadAll(rawBody)
	if readErr != nil {
		err = &UaaError{http.StatusBadRequest,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				readErr.Error() + "\"}")}
		return
	}

	// Read the response from inviting the user.
	jsonErr := json.Unmarshal(body, obj)
	if jsonErr != nil {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				jsonErr.Error() + "\"}")}
		return
	}
	return
}

// UaaError contains metadata for a particular UAA error.
type UaaError struct {
	statusCode int
	err        []byte
}

func (e *UaaError) writeTo(rw http.ResponseWriter) {
	rw.WriteHeader(e.statusCode)
	rw.Write(e.err)
}

type inviteUAAUserRequest struct {
	Emails []string `json:"emails"`
}

// GetUAAUserResponse is the expected form of a response from querying UAA
// for a specific user. It is only a partial representation.
type GetUAAUserResponse struct {
	Active     bool   `json:"active"`
	Verified   bool   `json:"verified"`
	ID         string `json:"id"`
	ExternalID string `json:"externalId"`
}

// InviteUAAUserResponse is the expected form of a response from invite users
// to UAA.
type InviteUAAUserResponse struct {
	NewInvites []NewInvite `json:"new_invites"`
}

// NewInvite is the contains detailed information about an single successful
// user invite to UAA.
type NewInvite struct {
	UserID     string `json:"userId"`
	Email      string `json:"email"`
	InviteLink string `json:"inviteLink"`
}

// InviteUAAuser tries to invite the user e-mail which will create the user in
// the UAA database.
func (c *UAAContext) InviteUAAuser(
	inviteUserToOrgRequest InviteUserToOrgRequest) (
	inviteResponse InviteUAAUserResponse, err *UaaError) {
	// Make request to UAA to invite user (which will create the user in the
	// UAA database)
	reqURL := fmt.Sprintf("%s%s",
		"/invite_users?redirect_uri=", c.Settings.AppURL)
	requestObj := inviteUAAUserRequest{[]string{inviteUserToOrgRequest.Email}}
	inviteUAAUserBody, jsonErr := json.Marshal(requestObj)
	if jsonErr != nil {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				jsonErr.Error() + "\"}"),
		}
		return
	}
	req, _ := http.NewRequest("POST", reqURL,
		bytes.NewBuffer(inviteUAAUserBody))
	req.Header.Set("Content-Type", "application/json")
	// TODO should look into using reverseproxy in httputil.
	w := httptest.NewRecorder()
	c.uaaProxy(w, req, reqURL, true)
	if w.Code != http.StatusOK {
		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				"unable to create user in UAA database.\", \"proxy-data\": \"" +
				string(body) + "\"}")}
		return
	}
	resp := w.Result()

	err = readBodyToStruct(resp.Body, &inviteResponse)
	return
}

type createCFUser struct {
	GUID string `json:"guid"`
}

// CreateCFuser will use the UAA user guid and create the user in the
// CF database.
func (c *UAAContext) CreateCFuser(userInvite NewInvite) (
	err *UaaError) {
	// Creating the JSON for the CF API request which will create the user in
	// CF database.
	cfCreateUserBody, jsonErr := json.Marshal(
		createCFUser{GUID: userInvite.UserID})
	if jsonErr != nil {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				jsonErr.Error() + "\"}"),
		}
		return
	}

	// Send the request to the CF API to create the user in the CF database.
	cfReq, _ := http.NewRequest("POST", "/v2/users",
		bytes.NewBuffer(cfCreateUserBody))
	w := httptest.NewRecorder()
	c.cfProxy(w, cfReq, "/v2/users")
	if w.Code != http.StatusCreated && w.Code != http.StatusBadRequest {
		resp := w.Result()
		var body []byte
		if resp.Body != nil {
			body, _ = ioutil.ReadAll(resp.Body)
		}
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", " +
				"\"data\": \"unable to create user in CF database.\", " +
				"\"proxy-data\": \"" + string(body) + "\"}"),
		}
	}
	return
}

// InviteUserToOrgRequest contains the JSON structure for the invite users
// request data.
type InviteUserToOrgRequest struct {
	Email string `json:"email"`
}

// ParseInviteUserToOrgReq will return InviteUserToOrgRequest based on the data
// in the request body.
func (c *UAAContext) ParseInviteUserToOrgReq(req *http.Request) (
	inviteUserToOrgRequest InviteUserToOrgRequest, err *UaaError) {
	err = readBodyToStruct(req.Body, &inviteUserToOrgRequest)
	return
}

// InviteUserToOrg will invite user in both UAA and CF, send an e-mail.
func (c *UAAContext) InviteUserToOrg(rw web.ResponseWriter, req *web.Request) {
	// parse the request
	inviteUserToOrgRequest, err := c.ParseInviteUserToOrgReq(req.Request)
	if err != nil {
		err.writeTo(rw)
		return
	}

	var getUserResp GetUAAUserResponse
	getUserResp, err = c.GetUAAUserByEmail(inviteUserToOrgRequest.Email)
	if err != nil {
		err.writeTo(rw)
		return
	}
	if !getUserResp.Verified {
		// Try to invite the user to UAA.
		inviteResponse, err := c.InviteUAAuser(inviteUserToOrgRequest)
		if err != nil {
			err.writeTo(rw)
			return
		}

		// If we don't have a successful invite, we return an error.
		if len(inviteResponse.NewInvites) < 1 {
			rw.WriteHeader(http.StatusInternalServerError)
			rw.Write([]byte("{\"status\": \"failure\", " +
				"\"data\": \"no successful invites created.\"}"))
			return
		}
		userInvite := inviteResponse.NewInvites[0]

		// Next try to create the user in CF
		err = c.CreateCFuser(userInvite)
		if err != nil {
			err.writeTo(rw)
			return
		}

		// Trigger the e-mail invite.
		err = c.TriggerInvite(inviteEmailRequest{
			Email:     userInvite.Email,
			InviteURL: userInvite.InviteLink,
		})
		if err != nil {
			err.writeTo(rw)
			return
		}
		// Set the user info that get from the newly invited user.
		getUserResp.ID = userInvite.UserID
	}

	rw.WriteHeader(http.StatusOK)
	rw.Write([]byte(fmt.Sprintf("{\"status\": \"success\", "+
		"\"userGuid\": \"%s\", "+
		"\"verified\": %t}", getUserResp.ID, getUserResp.Verified)))
}

// ListUAAUserResponse is the response representation of the User list query.
// https://docs.cloudfoundry.org/api/uaa/#list63
type ListUAAUserResponse struct {
	Resources []GetUAAUserResponse `json:"resources"`
}

// GetUAAUserByEmail will query UAA for user(s) by e-mail.
// Only return one user result.
// Special cases:
// If multiple are found, an empty response is returned.
// If none are found, an empty response is returned.
// Both special cases return no error.
func (c *UAAContext) GetUAAUserByEmail(email string) (
	userResponse GetUAAUserResponse, err *UaaError) {
	filterQuery := fmt.Sprintf("email eq \"%s\"", email)
	reqURL := fmt.Sprintf("/Users?filter=%s", url.QueryEscape(filterQuery))
	reqVerify, _ := http.NewRequest("GET", reqURL, nil)
	w := httptest.NewRecorder()
	c.uaaProxy(w, reqVerify, reqURL, true)
	// It will always return StatusOK even if it returns an empty resources list.
	if w.Code != http.StatusOK {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				"unable to find user.\"}")}
		return
	}
	resp := w.Result()
	var listUsersResponse ListUAAUserResponse
	err = readBodyToStruct(resp.Body, &listUsersResponse)
	if err != nil {
		return
	}
	// In the case we don't find anything or find duplicates, just return.
	if len(listUsersResponse.Resources) != 1 {
		return
	}

	// In the case we find one, let's return that.
	userResponse = listUsersResponse.Resources[0]
	return
}

type inviteEmailRequest struct {
	Email     string `json:"email"`
	InviteURL string `json:"inviteUrl"`
}

// TriggerInvite trigger the email.
func (c *UAAContext) TriggerInvite(inviteReq inviteEmailRequest) (
	err *UaaError) {
	if inviteReq.Email == "" || inviteReq.InviteURL == "" {
		err = &UaaError{http.StatusBadRequest,
			[]byte("{\"status\": \"failure\", " +
				"\"data\": \"Missing correct params.\"}"),
		}
		return
	}
	emailHTML := new(bytes.Buffer)
	tplErr := c.templates.GetInviteEmail(emailHTML, inviteReq.InviteURL)
	if tplErr != nil {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				tplErr.Error() + "\" }"),
		}
		return
	}
	emailErr := c.mailer.SendEmail(inviteReq.Email, "Invitation to join cloud.gov", emailHTML.Bytes())
	if emailErr != nil {
		err = &UaaError{http.StatusInternalServerError,
			[]byte("{\"status\": \"failure\", \"data\": \"" +
				emailErr.Error() + "\" }"),
		}
		return
	}
	return
}

// UaaInfo returns the UAA_API/Users/:id information for the logged in user.
func (c *UAAContext) UaaInfo(rw web.ResponseWriter, req *web.Request) {
	guid := req.URL.Query().Get("uaa_guid")
	if len(guid) > 0 {
		reqURL := fmt.Sprintf("%s%s", "/Users/", guid)
		c.uaaProxy(rw, req.Request, reqURL, false)
	} else {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"Bad request\", \"error_description\": \"Missing valid guid.\"}"))
	}
}
