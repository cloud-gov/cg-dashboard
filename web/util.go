package main

import (
	"context"
	"crypto/tls"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

// GetHttpClient returns a configured http client
func GetHttpClient(skipSSLVerify bool) *http.Client {
	httpClient := http.DefaultClient
	if skipSSLVerify {
		httpClient.Transport = &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
	}
	return httpClient
}

// CreateContext returns a new context to be used for http connections.
func CreateContext(skipSSLVerify bool) context.Context {
	ctx := context.TODO()
	// If targeting local cf env, we won't have
	// valid SSL certs so we need to disable verifying them.
	if skipSSLVerify {
		ctx = context.WithValue(ctx, oauth2.HTTPClient, GetHttpClient(true))
	}
	return ctx
}

// TimeoutConstant is a constant which holds how long any incoming request should wait until we timeout.
// This is useful as some calls from the Go backend to the external API may take a long time.
// If the user decides to refresh or if the client is polling, multiple requests might build up. This timecaps them.
var TimeoutConstant = time.Second * 20
