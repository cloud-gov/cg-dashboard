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

func main() {
	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = "9999"
	}
	StartApp(port)
}

func StartApp(port string) {
	// Load environment variables
	envVars := LoadEnvVars()
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(envVars); err != nil {
		fmt.Println(err.Error())
		return
	}

	// Initialize the router
	router := controllers.InitRouter(&settings)

	http.ListenAndServe(":"+port, router)
}
