package mailer

import (
	"fmt"
	"net/smtp"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/jordan-wright/email"
)

// Mailer is a interface that any mailer should implement.
type Mailer interface {
	SendEmail(emailAddress string, subject string, html, text []byte) error
}

// NewSMTPMailer creates a new SMTP Mailer
func NewSMTPMailer(settings helpers.Settings) (Mailer, error) {
	return &smtpMailer{
		smtpHost:        settings.SMTPHost,
		smtpPort:        settings.SMTPPort,
		smtpUser:        settings.SMTPUser,
		smtpPass:        settings.SMTPPass,
		smtpFrom:        settings.SMTPFrom,
		deliveryAddress: settings.DeliveryAddress,
	}, nil
}

type smtpMailer struct {
	smtpHost string
	smtpPort string
	smtpUser string
	smtpPass string
	smtpFrom string
	// deliveryAddress is the address to use when sending mail.
	// If provided, mail will always be sent to this address.
	// Use this field to restrict development mail from being sent to real life
	// recipients.
	deliveryAddress string
}

// SendEmail implements Mailer.
func (s *smtpMailer) SendEmail(emailAddress, subject string, html, text []byte) error {
	e := email.NewEmail()
	e.From = s.smtpFrom

	to := fmt.Sprintf("<%s>", emailAddress)
	if s.deliveryAddress == "" {
		e.To = []string{to}
	} else {
		e.To = []string{s.deliveryAddress}
		e.Headers.Add("Would-Send-To", to)
	}

	e.HTML = html
	e.Text = text
	e.Subject = subject

	return e.Send(
		fmt.Sprintf("%s:%s", s.smtpHost, s.smtpPort),
		smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost),
	)
}
