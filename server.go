//+build !test

package main

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"

	"fmt"
	"net/http"
	"os"
)

func loadEnvVars() helpers.EnvVars {
	envVars := helpers.EnvVars{}

	envVars.ClientID = os.Getenv(helpers.ClientIDEnvVar)
	envVars.ClientSecret = os.Getenv(helpers.ClientSecretEnvVar)
	envVars.Hostname = os.Getenv(helpers.HostnameEnvVar)
	envVars.AuthURL = os.Getenv(helpers.AuthURLEnvVar)
	envVars.TokenURL = os.Getenv(helpers.TokenURLEnvVar)
	envVars.APIURL = os.Getenv(helpers.APIEnvVar)
	return envVars
}

func main() {
	// Load environment variables
	envVars := loadEnvVars()
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(envVars); err != nil {
		fmt.Println(err.Error())
		return
	}

	// Initialize the router
	router := controllers.InitRouter(&settings)

	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = "9999"
	}
	http.ListenAndServe(":"+port, router)
}
