package helpers_test

import (
	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/helpers/testhelpers"

	"net/http"
	"testing"
)

type tokenTestData struct {
	testName        string
	sessionName     string
	sessionData     map[string]interface{}
	returnValueNull bool
}

var getValidTokenTests = []tokenTestData{
	{
		testName:        "Basic Valid Token Check",
		sessionData:     testhelpers.ValidTokenData,
		returnValueNull: false,
	},
	{
		testName:        "Basic Invalid Token Check",
		sessionData:     testhelpers.InvalidTokenData,
		returnValueNull: true,
	},
	{
		testName:        "No Session Data Check",
		sessionName:     "",
		returnValueNull: true,
	},
	{
		testName:        "Nil Session Check",
		sessionName:     "nilSession",
		returnValueNull: true,
	},
}

func TestGetValidToken(t *testing.T) {
	mockRequest, _ := http.NewRequest("GET", "", nil)
	mockSettings := helpers.Settings{}

	for _, test := range getValidTokenTests {
		// Initialize a new session store.
		store := testhelpers.MockSessionStore{}
		store.ResetSessionData(test.sessionData, test.sessionName)
		mockSettings.Sessions = store

		value := helpers.GetValidToken(mockRequest, &mockSettings)
		if (value == nil) == test.returnValueNull {
		} else {
			t.Errorf("Test %s did not meet expected value. Expected: %t. Actual: %t\n", test.testName, test.returnValueNull, (value == nil))
		}
	}
}
