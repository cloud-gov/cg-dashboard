package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gorilla/context"
	"github.com/gorilla/csrf"
	"github.com/yvasiyarov/gorelic"
)

const (
	defaultPort           = "9999"
	cfUserProvidedService = "dashboard-ups"
)

func main() {
	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = defaultPort
	}
	fmt.Println("using port: " + port)

	// Try to load the user-provided-service
	// for backup of certain environment variables.
	cfEnv, err := cfenv.Current()
	if err != nil || cfEnv == nil {
		fmt.Println("Warning: No Cloud Foundry Environment found")
	}

	startApp(port, cfEnv)
}

func startMonitoring(license string) {
	agent := gorelic.NewAgent()
	agent.Verbose = true
	agent.CollectHTTPStat = true
	agent.NewrelicLicense = license
	agent.NewrelicName = "Cloudgov Deck"
	if err := agent.Run(); err != nil {
		fmt.Println(err.Error())
	}
}

func startApp(port string, env *cfenv.App) {
	// Load environment variables
	envVars := loadEnvVars()
	// Override with Cloud Foundry user-provided service credentials if specified.
	loadUPSVars(&envVars, env)

	app, err := InitApp(envVars, env)
	if err != nil {
		// Print the error.
		fmt.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes.
		os.Exit(1)
	}
	if envVars.IsPProfEnabled() {
		InitPProfRouter(app)
	}

	if envVars.NewRelicLicense != "" {
		fmt.Println("starting monitoring...")
		startMonitoring(envVars.NewRelicLicense)
	}

	fmt.Println("starting app now...")

	// TODO add better timeout message. By default it will just say "Timeout"
	protect := csrf.Protect([]byte(envVars.SessionKey), csrf.Secure(envVars.IsUsingSecureCookies()))
	http.ListenAndServe(":"+port, protect(
		http.TimeoutHandler(context.ClearHandler(app), TimeoutConstant, ""),
	))
}
