package helpers

import (
	"fmt"
	"html/template"
	"io"
	"path/filepath"
)

const (
	// InviteEmailTemplate is the template key for the invite email.
	InviteEmailTemplate = "INVITE_EMAIL_TEMPLATE"
	// IndexTemplate is the template key for the index.html.
	IndexTemplate = "INDEX_HTML_TEMPLATE"
)

// findTemplates will try to construct to final path of where to find templates
// given the basePath of where to look.
func findTemplates(basePath string) map[string][]string {
	return map[string][]string{
		IndexTemplate:       {filepath.Join(basePath, "web", "index.html")},
		InviteEmailTemplate: {filepath.Join(basePath, "mail", "invite.html")},
	}
}

// Templates serve as a mapping to various templates.
// Each entry can be a compilation of multiple files mapped to a string entry.
// This works if we ever want to use the .define blocks which are good for
// creating a main template with swappable content.
// Similar to https://hackernoon.com/golang-template-2-template-composition-and-how-to-organize-template-files-4cb40bcdf8f6
type Templates struct {
	templates map[string]*template.Template
}

// InitTemplates will try to parse the templates.
func InitTemplates(basePath string) (*Templates, error) {
	templates := make(map[string]*template.Template)
	for templateName, templatePath := range findTemplates(basePath) {
		tpl, err := template.ParseFiles(templatePath...)
		if err != nil {
			return nil, err
		}
		templates[templateName] = tpl
	}
	return &Templates{templates}, nil
}

func (t *Templates) getTemplate(templateKey string) (*template.Template, error) {
	if template, ok := t.templates[templateKey]; ok {
		return template, nil
	}
	return nil, fmt.Errorf("unable to find template with key %s", templateKey)
}

// inviteEmail provides struct for the templates/mail/invite.tmpl
type inviteEmail struct {
	URL string
}

// GetInviteEmail gets the filled in invite email template.
func (t *Templates) GetInviteEmail(rw io.Writer, url string) error {
	tpl, err := t.getTemplate(InviteEmailTemplate)
	if err != nil {
		return err
	}
	return tpl.Execute(rw, inviteEmail{url})
}

// GetIndex gets the filled in index.html
func (t *Templates) GetIndex(rw io.Writer, csrfToken, gaTrackingID, newRelicID,
	newRelicBrowserLicenseKey string) error {
	tpl, err := t.getTemplate(IndexTemplate)
	if err != nil {
		return err
	}
	return tpl.Execute(rw, map[string]interface{}{
		"csrfToken":                     csrfToken,
		"GA_TRACKING_ID":                gaTrackingID,
		"NEW_RELIC_ID":                  newRelicID,
		"NEW_RELIC_BROWSER_LICENSE_KEY": newRelicBrowserLicenseKey,
	})
}
