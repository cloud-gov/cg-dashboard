package mailer

import (
	"bytes"
	"html/template"
	"net/smtp"
	"path/filepath"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/jordan-wright/email"
)

const (
	// InviteEmailTemplate is the template key for the invite email.
	InviteEmailTemplate = "INVITE_EMAIL_TEMPLATE"
)

// Mailer is a interface that any mailer should implement.
type Mailer interface {
	SendInviteEmail(emailAddress, URL string) error
}

func getMailTemplates(settings helpers.Settings) map[string]string {
	return map[string]string{
		InviteEmailTemplate: filepath.Join(filepath.Join(settings.BasePath,
			"templates", "mail", "invite.tmpl")),
	}
}

// InitSMTPMailer creates a new SMTP Mailer
func InitSMTPMailer(settings helpers.Settings) (Mailer, error) {
	templates := make(map[string]*template.Template)
	for templateName, templatePath := range getMailTemplates(settings) {
		tpl, err := template.ParseFiles(templatePath)
		if err != nil {
			return nil, err
		}
		templates[templateName] = tpl
	}
	return &smtpMailer{
		templates: templates,
		smtpHost:  settings.SMTPHost,
		smtpPort:  settings.SMTPPort,
		smtpUser:  settings.SMTPUser,
		smtpPass:  settings.SMTPPass,
		smtpFrom:  settings.SMTPFrom,
	}, nil
}

type smtpMailer struct {
	templates map[string]*template.Template
	smtpHost  string
	smtpPort  string
	smtpUser  string
	smtpPass  string
	smtpFrom  string
}

// inviteEmail provides struct for the templates/mail/invite.tmpl
type inviteEmail struct {
	URL string
}

func (s *smtpMailer) SendInviteEmail(emailAddress, URL string) error {
	emailHTML := new(bytes.Buffer)
	err := s.templates[InviteEmailTemplate].Execute(emailHTML, inviteEmail{URL})
	if err != nil {
		return err
	}
	return s.sendEmail(emailAddress,
		"Invitation to join cloud.gov",
		emailHTML.Bytes())
}

func (s *smtpMailer) sendEmail(emailAddress, subject string, body []byte) error {
	e := email.NewEmail()
	e.From = "cloud.gov <" + s.smtpFrom + ">"
	e.To = []string{" <" + emailAddress + ">"}
	e.HTML = body
	e.Subject = subject
	return e.Send(s.smtpHost+":"+s.smtpPort, smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost))
}
