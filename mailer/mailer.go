package mailer

import (
	"crypto/tls"
	"crypto/x509"
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
	var tlsConfig *tls.Config
	if settings.SMTPCert != "" {
		pool := x509.NewCertPool()
		pool.AppendCertsFromPEM([]byte(settings.SMTPCert))
		tlsConfig = &tls.Config{
			ServerName: settings.SMTPHost,
			RootCAs:    pool,
		}

	}
	return &smtpMailer{
		smtpHost:  settings.SMTPHost,
		smtpPort:  settings.SMTPPort,
		smtpUser:  settings.SMTPUser,
		smtpPass:  settings.SMTPPass,
		smtpFrom:  settings.SMTPFrom,
		smtpCert:  settings.SMTPCert,
		tlsConfig: tlsConfig,
	}, nil
}

type smtpMailer struct {
	smtpHost  string
	smtpPort  string
	smtpUser  string
	smtpPass  string
	smtpFrom  string
	smtpCert  string
	tlsConfig *tls.Config
}

func (s *smtpMailer) SendEmail(emailAddress, subject string, body []byte) error {
	e := email.NewEmail()
	e.From = s.smtpFrom
	e.To = []string{" <" + emailAddress + ">"}
	e.HTML = body
	e.Subject = subject

	addr := s.smtpHost + ":" + s.smtpPort
	auth := smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost)

	if s.tlsConfig != nil {
		return e.SendWithTLS(addr, auth, s.tlsConfig)
	}
	return e.Send(s.smtpHost+":"+s.smtpPort, smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost))
}
