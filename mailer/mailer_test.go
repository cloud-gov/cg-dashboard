package mailer

import (
	"os"
	"testing"

	"github.com/18F/cg-dashboard/helpers"
)

func TestSendUserInvite(t *testing.T) {

}

func TestInitSMTPMailer(t *testing.T) {
	// Test InitSMTPMailer with valid path for templates.
	settings := helpers.Settings{
		BasePath: os.Getenv(helpers.BasePathEnvVar),
	}
	mailer, err := InitSMTPMailer(settings)
	if mailer == nil {
		t.Error("Expected non nil mailer.")
	}
	if err != nil {
		t.Errorf("Expected nil error, found %s", err.Error())
	}
	// Test InitSMTPMailer with invalid path for templates.
	settings = helpers.Settings{
		BasePath: "",
	}
	mailer, err = InitSMTPMailer(settings)
	if mailer != nil {
		t.Error("Expected  nil mailer.")
	}
	if err == nil {
		t.Errorf("Expected non nil error, found %s", err.Error())
	}
}
