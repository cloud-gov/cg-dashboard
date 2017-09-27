package templates_test

import (
	"bytes"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"github.com/18F/cg-dashboard/internal/templates"
)

func TestInitTemplates(t *testing.T) {
	// Valid case: correct base path to templates.
	_, err := templates.InitTemplates(os.Getenv("BASE_PATH"))
	if err != nil {
		t.Errorf("Expected to find the templates. %s", err.Error())
	}
	// Invalid case: incorrect base path to templates.
	_, err = templates.InitTemplates("blah")
	if err == nil {
		t.Error("Expected not to find the templates")
	}
}

func TestGetInviteEmail(t *testing.T) {
	templates, err := templates.InitTemplates(os.Getenv("BASE_PATH"))
	if err != nil {
		t.Errorf("Expected to find the templates. %s", err.Error())
	}
	body := new(bytes.Buffer)
	err = templates.GetInviteEmail(body, "http://test-url.com")
	if err != nil {
		t.Errorf("Expected no error getting the invite email. %s", err.Error())
	}
	inviteTpl, err := ioutil.ReadFile(filepath.Join(
		os.Getenv("BASE_PATH"), "testdata", "mail", "invite.html"))
	if err != nil {
		t.Errorf("Expected no error reading the invite email. %s", err.Error())
		return
	}
	if string(inviteTpl) != string(body.Bytes()) {
		t.Error("Expected invite e-mail template does not match generated invite e-mail template.")
		// Helpful for generating the new invite data.
		ioutil.WriteFile(filepath.Join(
			os.Getenv("BASE_PATH"), "testdata", "mail", "invite.html.returned"), body.Bytes(), 0444)
		t.Logf("writing expected file to %s", filepath.Join(
			os.Getenv("BASE_PATH"), "testdata", "mail", "invite.html.returned"))
	}
}

func TestGetIndex(t *testing.T) {
	templates, err := templates.InitTemplates(os.Getenv("BASE_PATH"))
	if err != nil {
		t.Errorf("Expected to find the templates. %s", err.Error())
	}
	body := new(bytes.Buffer)
	err = templates.GetIndex(body, "testCSRFToken", "test-gaTrackingID",
		"test-newRelicID", "test-newRelicBrowserLicenseKey")
	if err != nil {
		t.Errorf("Expected no error getting the index html. %s", err.Error())
	}
	inviteTpl, err := ioutil.ReadFile(filepath.Join(
		os.Getenv("BASE_PATH"), "testdata", "index.html"))
	if err != nil {
		t.Errorf("Expected no error reading the index.html. %s", err.Error())
		return
	}
	if string(inviteTpl) != string(body.Bytes()) {
		t.Error("Expected index.html template does not match generated index.html template.")
		// Helpful for generating the new invite data.
		ioutil.WriteFile(filepath.Join(
			os.Getenv("BASE_PATH"), "testdata", "index.html.returned"), body.Bytes(), 0444)
		t.Logf("writing expected file to %s", filepath.Join(
			os.Getenv("BASE_PATH"), "testdata", "index.html.returned"))
	}
}
