package helpers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

// TimeoutConstant is a constant which holds how long any incoming request should wait until we timeout.
// This is useful as some calls from the Go backend to the external API may take a long time.
// If the user decides to refresh or if the client is polling, multiple requests might build up. This timecaps them.
// This constant is also used in the acceptance testing "delayForRendering" for any pages that may take a long time to render.
// (Some of those pages use APIs that take a long time)
var TimeoutConstant = time.Second * 20

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

		// Attempt to refresh token using oauth2 Client
		// https://godoc.org/golang.org/x/oauth2#Config.Client
		reqURL := fmt.Sprintf("%s%s", settings.ConsoleAPI, "/v2/info")
		request, _ := http.NewRequest("GET", reqURL, nil)
		request.Close = true
		client := settings.OAuthConfig.Client(settings.TokenContext, &token)
		// Prevents lingering goroutines from living forever.
		// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
		client.Timeout = TimeoutConstant
		resp, err := client.Do(request)
		if resp != nil {
			defer resp.Body.Close()
		}
		if err != nil {
			return nil
		}
		return &token
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}

// GenerateRandomBytes returns securely generated random bytes.
// Borrowed from https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/
func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

// GenerateRandomString returns a URL-safe, base64 encoded
// securely generated random string.
// Borrowed from https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/
func GenerateRandomString(s int) (string, error) {
	b, err := GenerateRandomBytes(s)
	return base64.URLEncoding.EncodeToString(b), err
}
