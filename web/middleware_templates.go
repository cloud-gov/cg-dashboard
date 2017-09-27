package main

import (
	"github.com/18F/cg-dashboard/internal/templates"
	"github.com/gocraft/web"
)

func registerTemplatesMiddleware(router *web.Router, e *EnvVars) error {
	// Cache templates
	templates, err := templates.InitTemplates(e.BasePath)
	if err != nil {
		return err
	}
	// A closure that effectively loads the templates into every request.
	router.Middleware(func(c *Context, resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		c.templates = templates
		next(resp, req)
	})
	return nil
}
