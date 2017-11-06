package mailer

import (
	"net/smtp"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/jordan-wright/email"
)

// Mailer is a interface that any mailer should implement.
type Mailer interface {
	SendEmail(emailAddress string, subject string, body []byte) error
}

// InitSMTPMailer creates a new SMTP Mailer
func InitSMTPMailer(settings helpers.Settings) (Mailer, error) {
	return &smtpMailer{
		smtpHost: settings.SMTPHost,
		smtpPort: settings.SMTPPort,
		smtpUser: settings.SMTPUser,
		smtpPass: settings.SMTPPass,
		smtpFrom: settings.SMTPFrom,
	}, nil
}

type smtpMailer struct {
	smtpHost string
	smtpPort string
	smtpUser string
	smtpPass string
	smtpFrom string
}

func (s *smtpMailer) SendEmail(emailAddress, subject string, body []byte) error {
	e := email.NewEmail()
	e.From = s.smtpFrom
	e.To = []string{" <" + emailAddress + ">"}
	e.HTML = body
	e.Subject = subject
	return e.Send(s.smtpHost+":"+s.smtpPort, smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost))
}
