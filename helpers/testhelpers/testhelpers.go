package testhelpers

import (
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"net/http"
	"net/http/httptest"
	"time"
)

type MockSessionStore struct {
	session            sessions.Session
	currentSessionName string
}

func (store MockSessionStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	if store.currentSessionName == "nilSession" {
		return nil, nil
	}
	return &store.session, nil
}

func (store MockSessionStore) New(r *http.Request, name string) (*sessions.Session, error) {
	return &store.session, nil
}

func (store MockSessionStore) Save(r *http.Request, w http.ResponseWriter, s *sessions.Session) error {
	return nil
}

func (store *MockSessionStore) ResetSessionData(data map[string]interface{}, sessionName string) {
	// Initialize the map to empty.
	store.session.Values = make(map[interface{}]interface{})
	for key, value := range data {
		store.session.Values[key] = value
	}
	store.currentSessionName = sessionName
}

func NewTestRequest(method, path string) (*httptest.ResponseRecorder, *http.Request) {
	request, _ := http.NewRequest(method, path, nil)
	recorder := httptest.NewRecorder()

	return recorder, request
}

var InvalidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: (time.Now()).Add(-1 * time.Minute), AccessToken: "invalidsampletoken"},
}

var ValidTokenData = map[string]interface{}{
	"token": oauth2.Token{Expiry: time.Time{}, AccessToken: "sampletoken"},
}
