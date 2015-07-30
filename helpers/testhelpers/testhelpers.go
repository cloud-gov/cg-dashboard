package testhelpers

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"
	"github.com/gocraft/web"
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"net/http"
	"net/http/httptest"
	"time"
)

// MockSessionStore represents an easily fillable session store that implements
// gorilla's session store interface.
type MockSessionStore struct {
	session            *sessions.Session
	currentSessionName string
	options            *sessions.Options
}

// Get simply returns the session that has pre populated beforehand with ResetSessionData
// or will return nil if the session name that is given is 'nilSession'
func (store MockSessionStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	if store.currentSessionName == "nilSession" {
		return nil, nil
	}
	return store.session, nil
}

// New returns the current session. Does not create a new one. Not needed for mock sessions.
func (store MockSessionStore) New(r *http.Request, name string) (*sessions.Session, error) {
	return store.session, nil
}

// Save returns nil error. We save session data by using ResetSessionData
func (store MockSessionStore) Save(r *http.Request, w http.ResponseWriter, s *sessions.Session) error {
	return nil
}

// ResetSessionData zero initializes the MockSessionStore and then will copy the input session data into it.
func (store *MockSessionStore) ResetSessionData(data map[string]interface{}, sessionName string) {
	store.options = &sessions.Options{
		Path:   "/",
		MaxAge: 86400 * 30,
	}
	// Initialize the map to empty.
	store.session = sessions.NewSession(store, sessionName)
	for key, value := range data {
		store.session.Values[key] = value
	}
	store.currentSessionName = sessionName
	opts := *store.options
	store.session.Options = &opts
}

// NewTestRequest is a helper function that creates a sample request with the given input parameters.
func NewTestRequest(method, path string) (*httptest.ResponseRecorder, *http.Request) {
	request, _ := http.NewRequest(method, path, nil)
	recorder := httptest.NewRecorder()

	return recorder, request
}

// InvalidTokenData is a dataset which represents an invalid token. Useful for unit tests.
var InvalidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: (time.Now()).Add(-1 * time.Minute), AccessToken: "invalidsampletoken"},
}

// ValidTokenData is a dataset which represents a valid token. Useful for unit tests.
var ValidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: time.Time{}, AccessToken: "sampletoken"},
}

// CreateRouterWithMockSession will create a settings with the appropriate envVars and load the mock session with the session data.
func CreateRouterWithMockSession(sessionData map[string]interface{}, envVars helpers.EnvVars) *web.Router {
	// Initialize settings.
	settings := helpers.Settings{}
	settings.InitSettings(envVars)

	// Initialize a new session store.
	store := MockSessionStore{}
	store.ResetSessionData(sessionData, "")

	// Override the session store.
	settings.Sessions = store

	// Create the router.
	router := controllers.InitRouter(&settings)

	return router
}
