package mailer

import (
	"fmt"
	"strings"
	"testing"

	"github.com/18F/cg-dashboard/helpers"
	. "github.com/18F/cg-dashboard/helpers/testhelpers/docker"
)

func TestSendEmail(t *testing.T) {
	hostname, smtpPort, apiPort, cleanup := CreateTestMailCatcher(t)
	settings := helpers.Settings{
		SMTPHost: hostname,
		SMTPPort: smtpPort,
		SMTPFrom: "test@dashboard.com",
	}
	mailer, err := NewSMTPMailer(settings)
	if err != nil {
		t.Fatal(err)
	}
	html := []byte("<strong>html</strong>")
	text := []byte("text")
	if err := mailer.SendEmail("recipient@example.com", "subject", html, text); err != nil {
		t.Errorf("SendEmail() err = %v, want none", err)
	}
	b, err := GetLatestMailMessageData(hostname, apiPort)
	if err != nil {
		t.Fatal(err)
	}
	message := string(b)
	if want := "test@dashboard.com"; !strings.Contains(message, fmt.Sprintf(`"sender":"<%s>"`, want)) {
		t.Errorf("sender was wrong, want %q", want)
	}
	if want := "recipient@example.com"; !strings.Contains(message, fmt.Sprintf(`"recipients":["<%s>"]`, want)) {
		t.Errorf("recipient was wrong, want %q", want)
	}
	if want := "subject"; !strings.Contains(message, fmt.Sprintf(`"subject":"%s"`, want)) {
		t.Errorf("subject was wrong, want %q", want)
	}

	cleanup()

	// Try sending mail to bad server.
	err = mailer.SendEmail("recipient@example.com", "sample subject", html, text)
	if err == nil {
		t.Error("got nil error, want something")
	}
}

func TestNewSMTPMailer(t *testing.T) {
	settings := helpers.Settings{}
	mailer, err := NewSMTPMailer(settings)
	if err != nil {
		t.Errorf("error = %v, want nil", err)
	}
	if mailer == nil {
		t.Error("mailer = nil, want something")
	}
}
