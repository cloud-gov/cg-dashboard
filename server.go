package main

import (
	"github.com/gocraft/web"
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"encoding/gob"
	"fmt"
	"net/http"
)

var (
	// OAuthConfig is the OAuth client with all the paramters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Sessions is the session store for all connected users.
	Sessions sessions.Store
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
	*Context    // Required.
	AccessToken string
}

// OAuth is a middle ware that checks whether or not the user has
func (c *APIContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
	// Get Token from session store.
	session, _ := Sessions.Get(req.Request, "session")

	if token, ok := session.Values["token"].(oauth2.Token); ok {
		c.AccessToken = token.AccessToken
		// TODO: Check if access token is valid.
		// TODO: If token not valid, refresh.
		// TODO: If can't refresh, redirect to login.
	} else {
		fmt.Println("unable to find")
		// If no token, need to redirect.
		http.Redirect(rw, req.Request, OAuthConfig.AuthCodeURL("state", oauth2.AccessTypeOnline), http.StatusFound)
		return
	}
	// Proceed to the next middleware or to the handler if last middleware.
	next(rw, req)
}

// OAuthCallback is the function that is called when the UAA provider uses the "redirect_uri" field to call back to this backend.
// This funciton will extract the code, get the access token and refresh token and save it into 1) the session and 2) the context (TODO)
func (c *Context) OAuthCallback(rw web.ResponseWriter, req *web.Request) {
	code := req.URL.Query().Get("code")

	if len(code) < 1 {
		// TODO: error.
	}

	// Exchange the code for a token.
	token, err := OAuthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		fmt.Println("Unable to get access token from code " + code + " error " + err.Error())
		return
		// TODO: Handle. Return 500.
	}

	// Ignore error, Get will return a session, existing or new.
	session, _ := Sessions.Get(req.Request, "session")
	session.Values["token"] = *token

	// Save token.AccessToken to context struct TODO.

	// Save session.
	err = session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}

	fmt.Println("made it with: " + token.AccessToken)

}

// All is a test function that just returns test to ensure that we can't get here without the OAuth Middleware.
// TODO: Remove
func (c *APIContext) All(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "test")
}

func main() {
	// Setup OAuth2 Client Service.
	OAuthConfig = &oauth2.Config {
		ClientID: "oauth_web_client",
		ClientSecret: "oauth_secret",
		RedirectURL: "http://localhost:9999/oauth2callback",
		Scopes: []string{"oauth.admin"},
		Endpoint: oauth2.Endpoint{
			AuthURL: "http://login.10.244.0.34.xip.io/oauth/authorize",
			TokenURL: "http://uaa.10.244.0.34.xip.io/oauth/token",
		},
	}

	// Initialize Sessions.
	Sessions = sessions.NewCookieStore([]byte("secret-key"))
	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	// Backend Route Initialization
	// Initialize the Gocraft Router with the basic context and routes
	router := web.New(Context{})
	router.Get("/ping", (*Context).Ping)
	router.Get("/oauth2callback", (*Context).OAuthCallback)

	// Setup the /api subrouter.
	apiRouter := router.Subrouter(APIContext{}, "/api")
	apiRouter.Middleware((*APIContext).OAuth)
	apiRouter.Get("/all", (*APIContext).All)

	// Frontend Route Initialization
	// Set up static file serving to load from the static folder.
	router.Middleware(web.StaticMiddleware("static", web.StaticOption{IndexFile: "index.html"}))

	// Start the server up.
	http.ListenAndServe("localhost:9999", router)
}
