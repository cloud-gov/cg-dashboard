package mailer

// Mailer is a interface that any mailer should implement.
type Mailer interface {
	SendEmail(emailAddress string, subject string, body []byte) error
}
