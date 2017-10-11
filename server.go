package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

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
	// Allow environment variable to override default name for user provided service.
	// Should be a colon separated list of user provided service names.
	// They will be searched in that order
	userProvidedServicePath := os.Getenv("UPS_PATH")
	if userProvidedServicePath == "" {
		userProvidedServicePath = cfUserProvidedService
	}
	userProvidedServicePathElements := strings.Split(userProvidedServicePath, ":")
	lookupPath := make([]helpers.EnvLookup, len(userProvidedServicePathElements)+1)
	for i, name := range userProvidedServicePathElements {
		lookupPath[i] = helpers.NewEnvLookupFromCFAppNamedService(env, name)
	}

	// Fallback to the environment if not found in the path.
	// TODO -> consider whether this behavior is correct - it is likely that
	// it would be more intuitive for an environment variable to override what
	// is set in a user provided service, however we keep this ordering for now
	// to match previous behavior.
	lookupPath[len(lookupPath)-1] = os.LookupEnv

	// Look for env vars first in a user provided service (if available), and if not found,
	// fallback to the environment.
	envVars := helpers.NewEnvVarsFromPath(lookupPath...)

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
