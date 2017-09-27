package mailer

import (
	"errors"
	"net/smtp"

	"github.com/jordan-wright/email"
)

// InitSMTPMailer creates a new SMTP Mailer
func InitSMTPMailer(host, port, user, pass, from string) (Mailer, error) {
	// At minimum, we need a valid host and from address
	if host == "" {
		return nil, errors.New("Missing host for smtp mailer")
	}
	if from == "" {
		return nil, errors.New("Missing from address for smtp mailer")
	}
	return &smtpMailer{
		smtpHost: host,
		smtpPort: port,
		smtpUser: user,
		smtpPass: pass,
		smtpFrom: from,
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
	e.From = "cloud.gov <" + s.smtpFrom + ">"
	e.To = []string{" <" + emailAddress + ">"}
	e.HTML = body
	e.Subject = subject
	return e.Send(s.smtpHost+":"+s.smtpPort, smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost))
}
