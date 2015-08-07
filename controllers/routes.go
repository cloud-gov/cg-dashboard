package controllers

import (
	"github.com/18F/cf-deck/helpers"
	"github.com/gocraft/web"
)

// InitRouter sets up the router (and subrouters).
// It also includes the closure middleware where we load the global Settings reference into each request.
func InitRouter(settings *helpers.Settings) *web.Router {
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

	// Setup the /api subrouter.
	apiRouter := router.Subrouter(APIContext{}, "/v2")
	apiRouter.Middleware((*APIContext).OAuth)
	// All routes accepted
	apiRouter.Get("/authstatus", (*APIContext).AuthStatus)
	apiRouter.Get("/logout", (*APIContext).Logout)
	apiRouter.Get("/profile", (*APIContext).UserProfile)
	apiRouter.Get("/:*", (*APIContext).Proxy)
	apiRouter.Put("/:*", (*APIContext).Proxy)
	apiRouter.Post("/:*", (*APIContext).Proxy)
	apiRouter.Delete("/:*", (*APIContext).Proxy)

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
