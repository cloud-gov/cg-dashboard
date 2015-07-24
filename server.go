//+build !test

package main

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"

	"fmt"
	"net/http"
	"os"
)

func LoadEnvVars() helpers.EnvVars {
	envVars := helpers.EnvVars{}

	envVars.ClientID = os.Getenv(helpers.ClientIDEnvVar)
	envVars.ClientSecret = os.Getenv(helpers.ClientSecretEnvVar)
	envVars.Hostname = os.Getenv(helpers.HostnameEnvVar)
	envVars.LoginURL = os.Getenv(helpers.LoginURLEnvVar)
	envVars.UAAURL = os.Getenv(helpers.UAAURLEnvVar)
	envVars.APIURL = os.Getenv(helpers.APIURLEnvVar)
	return envVars
}

var DefaultPort = "9999"

func main() {
	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = DefaultPort
	}
	StartApp(port)
}

func InitApp() (http.Handler, error) {
	// Load environment variables
	envVars := LoadEnvVars()
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(envVars); err != nil {
		return nil, err
	}

	// Initialize the router
	router := controllers.InitRouter(&settings)

	return router, nil
}

func StartApp(port string) {
	app, err := InitApp()
	if err != nil {
		// Print the error.
		fmt.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes. 
		os.Exit(1)
	}

	http.ListenAndServe(":"+port, app)
}
