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
	if token, ok := session.Values["token"].(string); ok {
		tok := new(oauth2.Token)
		tok.AccessToken = token

		// Attempt to refresh token using oauth2 Client
		// https://godoc.org/golang.org/x/oauth2#Config.Client
		reqURL := fmt.Sprintf("%s%s", settings.ConsoleAPI, "/v2/info")
		request, _ := http.NewRequest("GET", reqURL, nil)
		// request.Close = true
		client := settings.OAuthConfig.Client(settings.TokenContext, tok)
		resp, err := client.Do(request)
		if resp != nil {
			defer resp.Body.Close()
		}
		if err != nil {
			return nil
		}
		return tok
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}
