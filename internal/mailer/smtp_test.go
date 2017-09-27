package mailer

import (
	"bytes"
	"os"
	"strings"
	"testing"

	"github.com/18F/cg-dashboard/helpers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers/docker"
)

func TestSendEmail(t *testing.T) {
	hostname, smtpPort, apiPort, cleanup := CreateTestMailCatcher()
	// Test InitSMTPMailer with valid path for templates.
	settings := helpers.Settings{
		BasePath: os.Getenv(helpers.BasePathEnvVar),
		SMTPHost: hostname,
		SMTPPort: smtpPort,
		SMTPFrom: "test@dashboard.com",
	}
	mailer, err := InitSMTPMailer(settings)
	if mailer == nil {
		t.Error("Expected non nil mailer.")
	}
	if err != nil {
		t.Errorf("Expected nil error, found %s", err.Error())
	}
	body := bytes.NewBufferString("test html here")
	err = mailer.SendEmail("test@receiver.com", "sample subject", body.Bytes())
	if err != nil {
		t.Errorf("Expected nil error, found %s", err.Error())
	}
	receivedData, err := GetLatestMailMessageData(hostname, apiPort)
	if err != nil {
		t.Errorf("Expected nil error, found %s", err.Error())
	}
	if !strings.Contains(string(receivedData), `"sender":"<test@dashboard.com>"`) {
		t.Error("Expected to find sender metadata")
	}
	if !strings.Contains(string(receivedData), `"recipients":["<test@receiver.com>"]`) {
		t.Error("Expected to find receipient metadata")
	}
	if !strings.Contains(string(receivedData), `"subject":"sample subject"`) {
		t.Error("Expected to find receipient metadata")
	}
	// Useful for generating test data. Undo to learn more about the data.
	// log.Println(string(receivedData))

	cleanup() // Destroy the mail server.

	// Try sending mail to bad server.
	err = mailer.SendEmail("test@receiver.com", "sample subject", body.Bytes())
	if err == nil {
		t.Error("Expected non nil error")
	}
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
}
