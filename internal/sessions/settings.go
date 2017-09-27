package sessions

// GetSessionExpiration returns the session expiration time in seconds.
func GetSessionExpiration() int {
	// In the future, overrideen by env vars
	// 7 days at the most
	return 60 * 60 * 24 * 7
}
