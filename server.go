package main

import (
	"fmt"
	"net/http"
	"os"

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
	envVars.NewRelicLicense = os.Getenv(helpers.NewRelicLicenseEnvVar)
	envVars.SecureCookies = os.Getenv(helpers.SecureCookiesEnvVar)
	envVars.SessionBackend = os.Getenv(helpers.SessionBackendEnvVar)
	envVars.SessionKey = os.Getenv(helpers.SessionKeyEnvVar)
	envVars.BasePath = os.Getenv(helpers.BasePathEnvVar)
	envVars.SMTPHost = os.Getenv(helpers.SMTPHostEnvVar)
	envVars.SMTPPort = os.Getenv(helpers.SMTPPortEnvVar)
	envVars.SMTPUser = os.Getenv(helpers.SMTPUserEnvVar)
	envVars.SMTPPass = os.Getenv(helpers.SMTPPassEnvVar)
	envVars.SMTPFrom = os.Getenv(helpers.SMTPFromEnvVar)
	return envVars
}

func replaceEnvVar(envVars *helpers.EnvVars, envVar string, value interface{}) {
	if stringValue, ok := value.(string); ok {
		// only replace if non empty.
		if len(stringValue) < 1 {
			return
		}
		switch envVar {
		case helpers.ClientIDEnvVar:
			envVars.ClientID = stringValue
		case helpers.ClientSecretEnvVar:
			envVars.ClientSecret = stringValue
		case helpers.NewRelicLicenseEnvVar:
			envVars.NewRelicLicense = stringValue
		case helpers.SMTPHostEnvVar:
			envVars.SMTPHost = stringValue
		case helpers.SMTPPortEnvVar:
			envVars.SMTPPort = stringValue
		case helpers.SMTPUserEnvVar:
			envVars.SMTPUser = stringValue
		case helpers.SMTPPassEnvVar:
			envVars.SMTPPass = stringValue
		case helpers.SMTPFromEnvVar:
			envVars.SMTPFrom = stringValue
		}
	}
}

func loadUPSVars(envVars *helpers.EnvVars, cfEnv *cfenv.App) {
	if cfEnv == nil {
		return
	}

	if cfUPS, err := cfEnv.Services.WithName(cfUserProvidedService); err == nil {
		fmt.Println("User Provided Service found")
		if clientID, found := cfUPS.Credentials[helpers.ClientIDEnvVar]; found {
			fmt.Println("Replacing " + helpers.ClientIDEnvVar)
			replaceEnvVar(envVars, helpers.ClientIDEnvVar, clientID)
		}
		if clientSecret, found := cfUPS.Credentials[helpers.ClientSecretEnvVar]; found {
			fmt.Println("Replacing " + helpers.ClientSecretEnvVar)
			replaceEnvVar(envVars, helpers.ClientSecretEnvVar, clientSecret)
		}
		if newRelic, found := cfUPS.Credentials[helpers.NewRelicLicenseEnvVar]; found {
			fmt.Println("Replacing " + helpers.NewRelicLicenseEnvVar)
			replaceEnvVar(envVars, helpers.NewRelicLicenseEnvVar, newRelic)
		}
		if sessionKey, found := cfUPS.Credentials[helpers.SessionKeyEnvVar]; found {
			fmt.Println("Replacing " + helpers.SessionKeyEnvVar)
			replaceEnvVar(envVars, helpers.SessionKeyEnvVar, sessionKey)
		}

	} else {
		fmt.Println("CF Env error: " + err.Error())
	}
}

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
	// Override with cloud foundry user provided service credentials if specified.
	loadUPSVars(&envVars, env)

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

	if envVars.NewRelicLicense != "" {
		fmt.Println("starting monitoring...")
		startMonitoring(envVars.NewRelicLicense)
	}

	fmt.Println("starting app now...")

	// TODO add better timeout message. By default it will just say "Timeout"
	protect := csrf.Protect([]byte(envVars.SessionKey), csrf.Secure(settings.SecureCookies))
	http.ListenAndServe(":"+port, protect(
		http.TimeoutHandler(context.ClearHandler(app), helpers.TimeoutConstant, ""),
	))
}
