package main

import (
	"github.com/18F/cg-dashboard/internal/mailer"
	"github.com/gocraft/web"
)

func registerMailerMiddleware(router *web.Router, e *EnvVars) error {
	mailer, err := mailer.InitSMTPMailer(e.SMTPHost,
		e.SMTPPort, e.SMTPUser, e.SMTPPass, e.SMTPFrom)
	if err != nil {
		return err
	}
	// A closure that effectively loads the mailer into every request.
	router.Middleware(func(c *Context, resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		c.mailer = mailer
		next(resp, req)
	})
	return nil
}
