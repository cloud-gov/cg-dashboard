package helpers

import (
	"golang.org/x/oauth2"

	"net/http"
)

// GetValidToken is a helper function that returns a token struct only if it finds a non expired token for the session.
func GetValidToken(req *http.Request, settings *Settings) *oauth2.Token {
	// Get session from session store.
	session, _ := settings.Sessions.Get(req, "session")
	// If for some reason we can't get or create a session, bail out.
	if session == nil {
		return nil
	}

	// Attempt to get the token from this session.
	if token, ok := session.Values["token"].(oauth2.Token); ok {
		// If valid, just return.
		if token.Valid() {
			return &token
		}
		// If not valid, try to refresh the accesstoken with the refresh token.
		// TODO
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}
