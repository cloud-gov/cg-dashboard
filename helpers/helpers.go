package helpers

import (
	"golang.org/x/oauth2"

	"fmt"
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
		} else {
			// Attempt to refresh token using oauth2 Client
			// https://godoc.org/golang.org/x/oauth2#Config.Client
			req_url := fmt.Sprintf("%s%s", settings.ConsoleAPI, "/v2/info")
			request, _ := http.NewRequest("GET", req_url, nil)
			client := settings.OAuthConfig.Client(settings.TokenContext, &token)
			if _, err := client.Do(request); err != nil {
				return nil
			}
			return &token
		}
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}
