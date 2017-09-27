package random

import (
	"crypto/rand"
	"encoding/base64"
)

// generateBytes returns securely generated random bytes.
// Borrowed from https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/
func generateBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

// GenerateString returns a URL-safe, base64 encoded
// securely generated random string.
// Borrowed from https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/
func GenerateString(s int) (string, error) {
	b, err := generateBytes(s)
	return base64.URLEncoding.EncodeToString(b), err
}
