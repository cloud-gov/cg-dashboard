package main

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/controllers/pprof"
	"github.com/18F/cf-deck/helpers"
	"github.com/gorilla/context"

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
	envVars.LogURL = os.Getenv(helpers.LogURLEnvVar)
	envVars.PProfEnabled = os.Getenv(helpers.PProfEnabledEnvVar)
	envVars.BuildInfo = os.Getenv(helpers.BuildInfoEnvVar)
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

	app, settings, err := controllers.InitApp(envVars)
	if err != nil {
		// Print the error.
		fmt.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes.
		os.Exit(1)
	}
	if settings.PProfEnabled {
		pprof.InitPProfRouter(app)
	}

	// TODO add better timeout message. By default it will just say "Timeout"
	http.ListenAndServe(":"+port, http.TimeoutHandler(context.ClearHandler(app), helpers.TimeoutConstant, ""))
}
