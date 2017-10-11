package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/govau/cf-common"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gorilla/context"
	"github.com/gorilla/csrf"
	"github.com/yvasiyarov/gorelic"

	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/controllers/pprof"
	"github.com/18F/cg-dashboard/helpers"
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
	var envVars *cfcommon.EnvVars

	// If UPS_PATH is specified, then use the new default env loader,
	// which allows an env variable to override a UPS
	if os.Getenv("UPS_PATH") != "" {
		envVars = cfcommon.NewDefaultEnvLookup()
	} else {
		// else fallback to the old order, which is dashboard-ups, and then
		// fallback to os.LookupEnv
		envVars = cfcommon.NewEnvVarsFromPath(
			cfcommon.NewEnvLookupFromCFAppNamedService(env, cfUserProvidedService),
			os.LookupEnv,
		)
	}

	app, settings, err := controllers.InitApp(envVars, env)
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

	nrLicense := envVars.String(helpers.NewRelicLicenseEnvVar, "")
	if nrLicense != "" {
		fmt.Println("starting monitoring...")
		startMonitoring(nrLicense)
	}

	fmt.Println("starting app now...")

	// TODO add better timeout message. By default it will just say "Timeout"
	protect := csrf.Protect(settings.CSRFKey, csrf.Secure(settings.SecureCookies))
	http.ListenAndServe(":"+port, protect(
		http.TimeoutHandler(context.ClearHandler(app), helpers.TimeoutConstant, ""),
	))
}
