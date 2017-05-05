package controllers

import (
	"html/template"
	"path/filepath"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gocraft/web"

	"github.com/18F/cg-dashboard/helpers"
	"github.com/18F/cg-dashboard/mailer"
)

// InitRouter sets up the router (and subrouters).
// It also includes the closure middleware where we load the global Settings reference into each request.
func InitRouter(settings *helpers.Settings, templates *template.Template, mailer mailer.Mailer) *web.Router {
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
	uaaRouter.Post("/invite/email", (*UAAContext).SendInvite)
	uaaRouter.Post("/invite/users", (*UAAContext).InviteUsers)

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
func InitApp(envVars helpers.EnvVars, env *cfenv.App) (*web.Router, *helpers.Settings, error) {
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
	templates := template.Must(template.ParseFiles(filepath.Join(settings.BasePath, "static", "index.html")))

	// Initialize the router
	router := InitRouter(&settings, templates, mailer)

	return router, &settings, nil
}
