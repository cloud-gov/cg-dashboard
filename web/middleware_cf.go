package main

import (
	"errors"

	"github.com/cloudfoundry-community/go-cfclient"
	"github.com/gocraft/web"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

type cf struct {
	endpoint              *cfclient.Endpoint
	apiURL                string
	appURL                string
	oAuthConfig           *oauth2.Config
	privilegedOauthConfig *clientcredentials.Config
}

func registerCFMiddleware(router *web.Router, e *EnvVars) error {
	if len(e.ClientID) == 0 {
		return errors.New("missing client id")
	}
	if len(e.ClientSecret) == 0 {
		return errors.New("missing client secret")
	}
	if len(e.APIURL) == 0 {
		return errors.New("missing CF API URL")
	}
	// Safe guard: shouldn't run with insecure cookies if we are
	// in a non-development environment (i.e. production)
	if e.IsUsingSecureCookies() == false && e.IsUsingLocalCF() == false {
		return errors.New("cannot run with insecure cookies when targeting a production CF environment")
	}
	if len(e.Hostname) == 0 {
		return errors.New("app hostname missing")
	}
	client := GetHttpClient(e.IsUsingLocalCF())
	endpoint, err := cfclient.GetInfo(e.APIURL, client)
	if err != nil {
		return err
	}
	cf := &cf{
		endpoint,
		e.APIURL,
		e.Hostname,
		&oauth2.Config{
			ClientID:     e.ClientID,
			ClientSecret: e.ClientSecret,
			RedirectURL:  e.Hostname + "/oauth2callback",
			Scopes:       []string{"cloud_controller.read", "cloud_controller.write", "cloud_controller.admin", "scim.read", "openid"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  endpoint.AuthEndpoint + "/oauth/authorize",
				TokenURL: endpoint.TokenEndpoint + "/oauth/token",
			},
		},
		&clientcredentials.Config{
			ClientID:     e.ClientID,
			ClientSecret: e.ClientSecret,
			Scopes:       []string{"scim.invite", "cloud_controller.admin", "scim.read"},
			TokenURL:     endpoint.TokenEndpoint + "/oauth/token",
		},
	}

	router.Middleware(func(c *Context, resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		c.cf = cf
		next(resp, req)
	})

	return nil
}
