package main

import "github.com/gocraft/web"

type constants struct {
	buildInfo         string
	skipSSLValidation bool
}

// registerConstantsMiddleware
func registerConstantsMiddleware(router *web.Router, e *EnvVars) error {
	if len(e.BuildInfo) == 0 {
		e.BuildInfo = "developer-build"
	}
}
