package main

import (
	"github.com/gocraft/web"
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"

	"encoding/gob"
	"fmt"
	"net/http"
	"os"
)

var (
	// OAuthConfig is the OAuth client with all the paramters to talk with CF's UAA OAuth Provider.
	OAuthConfig *oauth2.Config
	// Sessions is the session store for all connected users.
	Sessions *sessions.FilesystemStore
)

// getValidToken is a helper function that returns a token struct only if it finds a non expired token for the session.
func getValidToken(req *web.Request) *oauth2.Token {
	// Get session from session store.
	session, _ := Sessions.Get(req.Request, "session")

	// Attempt to get the token from this session.
	if token, ok := session.Values["token"].(oauth2.Token); ok {
		// If valid, just return.
		if token.Valid() {
			return &token
		}
		// If not valid, try to refresh the accesstoken with the refresh token.
		// TODO
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}

// Context represents the context for all requests that do not need authentication.
type Context struct {
}

// Ping is just a test endpoint to show that indeed the service is alive.
// TODO. Remove.
func (c *Context) Ping(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "alive")
}

// LoginHandshake is the handler where we authenticate the user and the user authorizes this application access to information.
func (c *Context) LoginHandshake(rw web.ResponseWriter, req *web.Request) {
	if token := getValidToken(req); token != nil {
		// We should just go to dashboard if the user already has a valid token.
		http.Redirect(rw, req.Request, "/#/dashboard", http.StatusFound)

	} else {
		// Redirect to the Cloud Foundry Login place.
		http.Redirect(rw, req.Request, OAuthConfig.AuthCodeURL("state", oauth2.AccessTypeOnline), http.StatusFound)
	}
}

// OAuthCallback is the function that is called when the UAA provider uses the "redirect_uri" field to call back to this backend.
// This funciton will extract the code, get the access token and refresh token and save it into 1) the session and redirect to the
// frontend dashboard.
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

	// Save session.
	err = session.Save(req.Request, rw)
	if err != nil {
		fmt.Println("callback error: " + err.Error())
	}

	// Redirect to the dashboard.
	http.Redirect(rw, req.Request, "/#/dashboard", http.StatusFound)
	// TODO. Redirect to the original route.
}

// APIContext stores the session info and access token per user.
// All routes within APIContext represent the API routes
type APIContext struct {
	*Context    // Required.
	AccessToken string
}

// OAuth is a middle ware that checks whether or not the user has a valid token.
// If the token is present and still valid, it just passes it on.
// If the token is 1) present and expired or 2) not present, it will return unauthorized.
func (c *APIContext) OAuth(rw web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
	// Get valid token if it exists from session store.
	if token := getValidToken(req); token != nil {
		c.AccessToken = token.AccessToken
	} else {
		// If no token, return unauthorized.
		http.Error(rw, "{\"status\": \"unauthorized\"}", http.StatusUnauthorized)
		return
	}
	// Proceed to the next middleware or to the handler if last middleware.
	next(rw, req)
}

// All is a test function that just returns test to ensure that we can't get here without the OAuth Middleware.
// TODO: Remove
func (c *APIContext) All(rw web.ResponseWriter, req *web.Request) {
	fmt.Fprintf(rw, "test")
}

func main() {
	// Load the variables from the environment.
	var clientID string
	var clientSecret string
	var hostname string
	var authURL string
	var tokenURL string
	if clientID = os.Getenv("CONSOLE_CLIENT_ID"); len(clientID) == 0 {
		fmt.Printf("Unable to find 'CONSOLE_CLIENT_ID' in environment. Exiting.\n")
		return
	}
	if clientSecret = os.Getenv("CONSOLE_CLIENT_SECRET"); len(clientSecret) == 0 {
		fmt.Printf("Unable to find 'CONSOLE_CLIENT_SECRET' in environment. Exiting.\n")
		return
	}
	if hostname = os.Getenv("CONSOLE_HOSTNAME"); len(hostname) == 0 {
		fmt.Printf("Unable to find 'CONSOLE_HOSTNAME' in environment. Exiting.\n")
		return
	}
	if authURL = os.Getenv("CONSOLE_AUTH_URL"); len(authURL) == 0 {
		fmt.Printf("Unable to find 'CONSOLE_AUTH_URL' in environment. Exiting.\n")
		return
	}
	if tokenURL = os.Getenv("CONSOLE_TOKEN_URL"); len(tokenURL) == 0 {
		fmt.Printf("Unable to find 'CONSOLE_TOKEN_URL' in environment. Exiting.\n")
		return
	}

	// Setup OAuth2 Client Service.
	OAuthConfig = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  hostname + "/oauth2callback",
		Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  authURL,
			TokenURL: tokenURL,
		},
	}

	// Initialize Sessions.
	// Temp FIXME that fixes the problem of using a cookie store which would cause the secure encoding
	// of the oauth 2.0 token struct in production to exceed the max size of 4096 bytes.
	Sessions = sessions.NewFilesystemStore("", []byte("some key"))
	Sessions.MaxLength(4096 * 4)
	// Want to save a struct into the session. Have to register it.
	gob.Register(oauth2.Token{})

	// Backend Route Initialization
	// Initialize the Gocraft Router with the basic context and routes
	router := web.New(Context{})
	router.Get("/ping", (*Context).Ping)
	router.Get("/handshake", (*Context).LoginHandshake)
	router.Get("/oauth2callback", (*Context).OAuthCallback)

	// Setup the /api subrouter.
	apiRouter := router.Subrouter(APIContext{}, "/api")
	apiRouter.Middleware((*APIContext).OAuth)
	apiRouter.Get("/all", (*APIContext).All)

	// Frontend Route Initialization
	// Set up static file serving to load from the static folder.
	router.Middleware(web.StaticMiddleware("static", web.StaticOption{IndexFile: "index.html"}))

	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = "9999"
	}
	http.ListenAndServe(":" + port, router)
}
