package controllers

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"

	"encoding/json"

	"net/http"
	"net/http/httptest"
	"net/url"

	"github.com/gocraft/web"

	uuid "github.com/satori/go.uuid"
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

func readBodyToStruct(rawBody io.ReadCloser, obj interface{}) *UaaError {
	if rawBody == nil {
		return newUaaError(http.StatusBadRequest, "no body in request.")
	}
	defer rawBody.Close()
	body, readErr := ioutil.ReadAll(rawBody)
	if readErr != nil {
		return newUaaError(http.StatusBadRequest, readErr.Error())
	}

	// Read the response from inviting the user.
	jsonErr := json.Unmarshal(body, obj)
	if jsonErr != nil {
		return newUaaError(http.StatusInternalServerError, jsonErr.Error())
	}
	return nil
}

// UaaError contains metadata for a particular UAA error.
type UaaError struct {
	statusCode int
	err        []byte
}

func newUaaError(statusCode int, data string) *UaaError {
	return newUaaErrorWithProxyData(statusCode, data, "")
}

func newUaaErrorWithProxyData(statusCode int, data, proxyData string) *UaaError {
	jb, err := json.Marshal(struct {
		Status    string `json:"status"`
		Data      string `json:"data"`
		ProxyData string `json:"proxy-data,omitempty"`
	}{
		Status:    "failure",
		Data:      data,
		ProxyData: proxyData,
	})
	if err != nil {
		// If we get here, we're having a really bad day
		return &UaaError{
			statusCode: statusCode,
			err:        []byte("cannot marshal proper error"),
		}
	}
	return &UaaError{
		statusCode: statusCode,
		err:        jb,
	}
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
func (c *UAAContext) InviteUAAuser(inviteUserToOrgRequest InviteUserToOrgRequest) (inviteResponse InviteUAAUserResponse, err *UaaError) {
	// Make request to UAA to invite user (which will create the user in the
	// UAA database)
	reqURL := fmt.Sprintf("/invite_users?%s", url.Values{
		"redirect_uri": {c.Settings.AppURL},
	}.Encode())
	requestObj := inviteUAAUserRequest{[]string{inviteUserToOrgRequest.Email}}
	inviteUAAUserBody, jsonErr := json.Marshal(requestObj)
	if jsonErr != nil {
		err = newUaaError(http.StatusInternalServerError, jsonErr.Error())
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
		err = newUaaErrorWithProxyData(http.StatusInternalServerError, "unable to create user in UAA database.", string(body))
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
		err = newUaaError(http.StatusInternalServerError, jsonErr.Error())
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
		err = newUaaErrorWithProxyData(http.StatusInternalServerError, "unable to create user in CF database.", string(body))
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
			newUaaError(http.StatusInternalServerError, "no successful invites created.").writeTo(rw)
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
	json.NewEncoder(rw).Encode(struct {
		Status   string `json:"status"`
		UserGUID string `json:"userGuid"`
		Verified bool   `json:"verified"`
	}{
		Status:   "success",
		UserGUID: getUserResp.ID,
		Verified: getUserResp.Verified,
	})
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
	// Per https://tools.ietf.org/html/rfc7644#section-3.4.2.2, the value format in a SCIM query is JSON format
	emailJSONBytes, mErr := json.Marshal(email)
	if mErr != nil {
		err = newUaaError(http.StatusBadRequest, mErr.Error())
		return
	}
	reqURL := fmt.Sprintf("/Users?%s", url.Values{
		"filter": {fmt.Sprintf("email eq %s", emailJSONBytes)},
	}.Encode())
	reqVerify, _ := http.NewRequest("GET", reqURL, nil)
	w := httptest.NewRecorder()
	c.uaaProxy(w, reqVerify, reqURL, true)
	// It will always return StatusOK even if it returns an empty resources list.
	if w.Code != http.StatusOK {
		err = newUaaError(http.StatusInternalServerError, "unable to find user.")
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
func (c *UAAContext) TriggerInvite(inviteReq inviteEmailRequest) *UaaError {
	if inviteReq.Email == "" || inviteReq.InviteURL == "" {
		return newUaaError(http.StatusBadRequest, "Missing correct params.")
	}
	emailHTML := new(bytes.Buffer)
	tplErr := c.templates.GetInviteEmail(emailHTML, inviteReq.InviteURL)
	if tplErr != nil {
		return newUaaError(http.StatusInternalServerError, tplErr.Error())
	}
	emailErr := c.mailer.SendEmail(inviteReq.Email, "Invitation to join cloud.gov", emailHTML.Bytes())
	if emailErr != nil {
		log.Printf("error sending mail: %s\n", emailErr)
		return newUaaError(http.StatusInternalServerError, emailErr.Error())
	}
	return nil
}

// UaaInfo returns the UAA_API/Users/:id information for the logged in user.
func (c *UAAContext) UaaInfo(rw web.ResponseWriter, req *web.Request) {
	// Parse and validate the UUID
	guid, err := uuid.FromString(req.URL.Query().Get("uaa_guid"))
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(rw).Encode(struct {
			Status      string `json:"status"`
			Description string `json:"error_description"`
		}{
			Status:      "Bad request",
			Description: "Missing valid guid.",
		})
		return
	}

	// This is safe, as this produces the canonical form
	reqURL := fmt.Sprintf("/Users/%s", guid.String())
	c.uaaProxy(rw, req.Request, reqURL, false)
}
