package controllers

import (
	"github.com/18F/cf-console/helpers/testhelpers"

	"testing"
)

func TestPing(t *testing.T) {
	response, request := testhelpers.NewTestRequest("GET", "/ping")
	router := InitRouter(nil)
	router.ServeHTTP(response, request)
	if response.Body.String() != "{\"status\": \"alive\"}" {
		t.Errorf("Expected alive. Found %s\n", response.Body.String())
	}
}
