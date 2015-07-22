package helpers

import (
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"net/http"
	"testing"
	"time"
)

type mockSessionStore struct {
	session sessions.Session
}

func (store mockSessionStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	return &store.session, nil
}

func (store mockSessionStore) New(r *http.Request, name string) (*sessions.Session, error) {
	return &store.session, nil
}

func (store mockSessionStore) Save(r *http.Request, w http.ResponseWriter, s *sessions.Session) error {
	return nil
}

func (store *mockSessionStore) ResetSessionData(data map[string]interface{}) {
	// Initialize the map to empty.
	store.session.Values = make(map[interface{}]interface{})
	for key, value := range data {
		store.session.Values[key] = value
	}
}

type tokenTestData struct {
	testName string
	sessionData map[string]interface{}
	returnValueNull bool
}

var getValidTokenTests = []tokenTestData{
	{
		testName: "Basic Valid Token Check",
		sessionData: map[string]interface{}{
			"token": oauth2.Token{Expiry: time.Time{}, AccessToken: "sampletoken"},
		},
		returnValueNull: false,
	},
	{
		testName: "Basic Invalid Token Check",
		sessionData: map[string]interface{}{
			"token": oauth2.Token{Expiry: (time.Now()).Add(-1 * time.Minute), AccessToken: "sampletoken"},
		},
		returnValueNull: true,
	},


}

func TestGetValidToken(t *testing.T) {
	mockRequest, _ := http.NewRequest("GET", "", nil)
	mockSettings := Settings{}
	for _, test := range getValidTokenTests {
		// Initialize a new session store.
		store := mockSessionStore{}
		store.ResetSessionData(test.sessionData)
		mockSettings.Sessions = store

		value := GetValidToken(mockRequest, &mockSettings)
		if (value == nil) == test.returnValueNull {
		} else {
			t.Errorf("Test %s did not meet expected value. Expected: %t. Actual: %t\n", test.testName, test.returnValueNull, (value == nil))
		}
	}
}
