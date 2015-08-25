package controllers

import (
	"github.com/18F/cg-deck/helpers"
	"github.com/gocraft/web"
)

// InitRouter sets up the router (and subrouters).
// It also includes the closure middleware where we load the global Settings reference into each request.
func InitRouter(settings *helpers.Settings) *web.Router {
	if settings == nil {
		return nil
	}
	router := web.New(Context{})

	// A closure that effectively loads the Settings into every request.
	router.Middleware(func(c *Context, resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		c.Settings = settings
		next(resp, req)
	})

	// Backend Route Initialization
	// Initialize the Gocraft Router with the basic context and routes
	router.Get("/ping", (*Context).Ping)
	router.Get("/handshake", (*Context).LoginHandshake)
	router.Get("/oauth2callback", (*Context).OAuthCallback)

	// Secure all the other routes
	secureRouter := router.Subrouter(SecureContext{}, "/")

	// Setup the /api subrouter.
	apiRouter := secureRouter.Subrouter(APIContext{}, "/v2")
	apiRouter.Middleware((*APIContext).OAuth)
	// All routes accepted
	apiRouter.Get("/authstatus", (*APIContext).AuthStatus)
	apiRouter.Get("/logout", (*APIContext).Logout)
	apiRouter.Get("/profile", (*APIContext).UserProfile)
	apiRouter.Get("/:*", (*APIContext).APIProxy)
	apiRouter.Put("/:*", (*APIContext).APIProxy)
	apiRouter.Post("/:*", (*APIContext).APIProxy)
	apiRouter.Delete("/:*", (*APIContext).APIProxy)

	// Setup the /uaa subrouter.
	uaaRouter := secureRouter.Subrouter(UAAContext{}, "/uaa")
	uaaRouter.Middleware((*UAAContext).OAuth)
	uaaRouter.Get("/userinfo", (*UAAContext).UserInfo)
	uaaRouter.Post("/Users", (*UAAContext).QueryUser)

	// Setup the /log subrouter.
	logRouter := secureRouter.Subrouter(LogContext{}, "/log")
	logRouter.Middleware((*LogContext).OAuth)
	logRouter.Get("/recent", (*LogContext).RecentLogs)

	// Add auth middleware
	router.Middleware((*Context).LoginRequired)

	// Frontend Route Initialization
	// Set up static file serving to load from the static folder.
	router.Middleware(web.StaticMiddleware("static", web.StaticOption{IndexFile: "index.html"}))

	return router
}

// InitApp takes in envars and sets up the router and settings that will be used for the unstarted server.
func InitApp(envVars helpers.EnvVars) (*web.Router, *helpers.Settings, error) {
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(envVars); err != nil {
		return nil, nil, err
	}

	// Initialize the router
	router := InitRouter(&settings)

	return router, &settings, nil
}
