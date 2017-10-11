package controllers

import (
	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gocraft/web"
	cfcommon "github.com/govau/cf-common"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/mailer"
)

// InitRouter sets up the router (and subrouters).
// It also includes the closure middleware where we load the global Settings reference into each request.
func InitRouter(settings *helpers.Settings, templates *helpers.Templates, mailer mailer.Mailer) *web.Router {
	if settings == nil {
		return nil
	}
	router := web.New(Context{})

	// A closure that effectively loads the Settings into every request.
	router.Middleware(func(c *Context, resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		c.Settings = settings
		c.templates = templates
		c.mailer = mailer
		next(resp, req)
	})

	router.Get("/", (*Context).Index)

	// Backend Route Initialization
	// Initialize the Gocraft Router with the basic context and routes
	router.Get("/ping", (*Context).Ping)
	router.Get("/handshake", (*Context).LoginHandshake)
	router.Get("/oauth2callback", (*Context).OAuthCallback)
	router.Get("/logout", (*Context).Logout)

	// Secure all the other routes
	secureRouter := router.Subrouter(SecureContext{}, "/")

	// Setup the /api subrouter.
	apiRouter := secureRouter.Subrouter(APIContext{}, "/v2")
	apiRouter.Middleware((*APIContext).OAuth)
	// All routes accepted
	apiRouter.Get("/authstatus", (*APIContext).AuthStatus)
	apiRouter.Get("/profile", (*APIContext).UserProfile)
	apiRouter.Get("/:*", (*APIContext).APIProxy)
	apiRouter.Put("/:*", (*APIContext).APIProxy)
	apiRouter.Post("/:*", (*APIContext).APIProxy)
	apiRouter.Delete("/:*", (*APIContext).APIProxy)

	// Setup the /uaa subrouter.
	uaaRouter := secureRouter.Subrouter(UAAContext{}, "/uaa")
	uaaRouter.Middleware((*UAAContext).OAuth)
	uaaRouter.Get("/userinfo", (*UAAContext).UserInfo)
	uaaRouter.Get("/uaainfo", (*UAAContext).UaaInfo)
	uaaRouter.Post("/invite/users", (*UAAContext).InviteUserToOrg)

	// Setup the /log subrouter.
	logRouter := secureRouter.Subrouter(LogContext{}, "/log")
	logRouter.Middleware((*LogContext).OAuth)
	logRouter.Get("/recent", (*LogContext).RecentLogs)

	// Add auth middleware
	secureRouter.Middleware((*SecureContext).LoginRequired)

	// Frontend Route Initialization
	// Set up static file serving to load from the static folder.
	router.Middleware(StaticMiddleware("static"))

	return router
}

// InitApp takes in envars and sets up the router and settings that will be used for the unstarted server.
func InitApp(envVars *cfcommon.EnvVars, env *cfenv.App) (*web.Router, *helpers.Settings, error) {
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(envVars, env); err != nil {
		return nil, nil, err
	}
	mailer, err := mailer.InitSMTPMailer(settings)
	if err != nil {
		return nil, nil, err
	}

	// Cache templates
	templates, err := helpers.InitTemplates(settings.TemplatesPath)
	if err != nil {
		return nil, nil, err
	}

	// Initialize the router
	router := InitRouter(&settings, templates, mailer)

	return router, &settings, nil
}
