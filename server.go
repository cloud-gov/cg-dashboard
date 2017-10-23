package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/cloudfoundry-community/go-cfenv"
	"github.com/gorilla/context"
	"github.com/gorilla/csrf"
	"github.com/govau/cf-common/env"
	"github.com/yvasiyarov/gorelic"

	"github.com/18F/cg-dashboard/controllers"
	"github.com/18F/cg-dashboard/controllers/pprof"
	"github.com/18F/cg-dashboard/helpers"
)

const (
	defaultPort    = "9999"
	defaultUPSName = "dashboard-ups"

	envUPSNames = "UPS_NAMES"

	upsNamesEnvDelimiter = ":"
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

func startApp(port string, app *cfenv.App) {
	var opts []env.VarSetOpt

	upsNames := os.Getenv(envUPSNames)

	switch {
	// Look for UPS names in a delimited environment variable.
	case upsNames != "":
		opts = append(opts, env.WithOSLookup())

		// TODO(jonathaningram): we already have an app. Is this so we're making
		// sure that we definitely have it?
		app, err := cfenv.Current()
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		for _, name := range strings.Split(upsNames, upsNamesEnvDelimiter) {
			if name = strings.TrimSpace(name); name != "" {
				opts = append(opts, env.WithUPSLookup(app, name))
			}
		}
	// Use the hard-coded UPS named `defaultUPSName` followed by the OS.
	default:
		opts = append(opts,
			env.WithUPSLookup(app, defaultUPSName),
			env.WithOSLookup(),
		)
	}

	envVars := env.NewVarSet(opts...)

	router, settings, err := controllers.InitApp(envVars, app)
	if err != nil {
		fmt.Println(err.Error())
		// Terminate the program with a non-zero value number.
		// Need this for testing purposes.
		os.Exit(1)
	}
	if settings.PProfEnabled {
		pprof.InitPProfRouter(router)
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
		http.TimeoutHandler(context.ClearHandler(router), helpers.TimeoutConstant, ""),
	))
}
