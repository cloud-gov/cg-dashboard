package main

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"

	_ "github.com/onsi/ginkgo"     // Needed for acceptance package.
	_ "github.com/onsi/gomega"     // Needed for acceptance package.
	_ "github.com/sclevine/agouti" // Needed for acceptance package.

	"log"
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
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	log.Println("Deck listening to port", port)
	startApp(port)
}

func startApp(port string) {
	// Load environment variables
	envVars := loadEnvVars()

	app, _, err := controllers.InitApp(envVars)
	if err != nil {
		// Print the error.
		log.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes.
		os.Exit(1)
	}

	http.ListenAndServe(":"+port, app)
}
