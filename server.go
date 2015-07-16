package main

import (
	"github.com/gocraft/web"

	"fmt"
	"net/http"
)

// Context represents the context for all requests that do not need authentication.
type Context struct {
}

// Ping is just a test endpoint to show that indeed the service is alive.
// TODO. Remove.
func (c *Context) Ping(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "alive")
}

// APIContext stores the session info and access token per user.
// All routes within APIContext represent the API routes
type APIContext struct {
	Session     map[string]string
	AccessToken string
}

func main() {
	// Backend Route Initialization
	// Initialize the Gocraft Router with the basic context and routes
	router := web.New(Context{})
	router.Get("/ping", (*Context).Ping)

	// Frontend Route Initialization
	// Set up static file serving to load from the static folder.
	router.Middleware(web.StaticMiddleware("static", web.StaticOption{IndexFile: "index.html"}))

	// Start the server up.
	http.ListenAndServe("localhost:9999", router)
}
