package main

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"

	_ "github.com/onsi/ginkgo"     // Needed for acceptance package.
	_ "github.com/onsi/gomega"     // Needed for acceptance package.
	_ "github.com/sclevine/agouti" // Needed for acceptance package.

	"fmt"
	"net/http"
	"os"
)

var defaultPort = "9999"

func loadEnvVars() helpers.EnvVars {
	envVars := helpers.EnvVars{}

	envVars.ClientID = os.Getenv(helpers.ClientIDEnvVar)
	envVars.ClientSecret = os.Getenv(helpers.ClientSecretEnvVar)
	envVars.Hostname = os.Getenv(helpers.HostnameEnvVar)
	envVars.LoginURL = os.Getenv(helpers.LoginURLEnvVar)
	envVars.UAAURL = os.Getenv(helpers.UAAURLEnvVar)
	envVars.APIURL = os.Getenv(helpers.APIURLEnvVar)
	envVars.PProfEnabled = os.Getenv(helpers.PProfEnabledEnvVar)
	return envVars
}

func main() {
	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = defaultPort
	}
	startApp(port)
}

func startApp(port string) {
	// Load environment variables
	envVars := loadEnvVars()

	app, _, err := controllers.InitApp(envVars)
	if err != nil {
		// Print the error.
		fmt.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes.
		os.Exit(1)
	}

	http.ListenAndServe(":"+port, app)
}
