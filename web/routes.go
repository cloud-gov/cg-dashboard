package main

import (
	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gocraft/web"
)

// InitRouter sets up the router (and subrouters).
// It also includes the closure middleware where we load the global Settings reference into each request.
func InitRouter(envVars EnvVars) *web.Router {
	router := web.New(Context{})

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
func InitApp(envVars EnvVars, env *cfenv.App) (*web.Router, error) {

	// Initialize the router
	router := InitRouter(envVars)

	return router, nil
}
