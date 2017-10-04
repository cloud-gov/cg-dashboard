package helpers

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

// TimeoutConstant is a constant which holds how long any incoming request should wait until we timeout.
// This is useful as some calls from the Go backend to the external API may take a long time.
// If the user decides to refresh or if the client is polling, multiple requests might build up. This timecaps them.
var TimeoutConstant = time.Second * 20

// GetValidToken is a helper function that returns a token struct only if it finds a non expired token for the session.
func GetValidToken(req *http.Request, rw http.ResponseWriter, settings *Settings) *oauth2.Token {
	// Get session from session store.
	session, _ := settings.Sessions.Get(req, "session")
	// If for some reason we can't get or create a session, bail out.
	if session == nil {
		return nil
	}

	// Attempt to get the token from this session.
	token, ok := session.Values["token"].(oauth2.Token)
	if !ok {
		return nil
	}

	// Save our original refresh token, we might need it further down
	originalRefreshToken := token.RefreshToken

	// Will ensure not expired
	rv, err := settings.OAuthConfig.TokenSource(settings.CreateContext(), &token).Token()
	if err != nil {
		return nil
	}

	// Did it change? if so save it in our cookie so we don't have to refresh again on every request
	if rv.AccessToken != token.AccessToken || !rv.Expiry.Equal(token.Expiry) {
		// If we are using opaque UAA tokens, then make sure we replace any new refresh
		// token received with the smaller opaque one that we saved off earlier, or we
		// may hit session storage limits.
		if settings.OpaqueUAATokens {
			rv.RefreshToken = originalRefreshToken
		}
		session.Values["token"] = *rv
		session.Save(req, rw)
	}

	return rv
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
