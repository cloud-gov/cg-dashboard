// +build acceptance

package util

import (
	"github.com/18F/cf-deck/helpers"
	"fmt"
	"os"
)

// Helper composite struct to store all the regular env variables as well as the ones for this test suite.
type AcceptanceTestEnvVars struct {
	helpers.EnvVars
	Username string
	Password string
}

// Helper function to load all the variables needed.
func (ev *AcceptanceTestEnvVars) LoadTestEnvVars() {
	ev.Username = os.Getenv("CONSOLE_TEST_USERNAME")
	ev.Password = os.Getenv("CONSOLE_TEST_PASSWORD")

	if len(ev.Username) < 1 {
		fmt.Println("Please set CONSOLE_TEST_USERNAME")
		os.Exit(1)
	}

	if len(ev.Password) < 1 {
		fmt.Println("Please set CONSOLE_TEST_PASSWORD")
		os.Exit(1)
	}
	// The app will catch the rest of these
	ev.ClientID = os.Getenv(helpers.ClientIDEnvVar)
	ev.ClientSecret = os.Getenv(helpers.ClientSecretEnvVar)
	ev.Hostname = os.Getenv(helpers.HostnameEnvVar)
	ev.LoginURL = os.Getenv(helpers.LoginURLEnvVar)
	ev.UAAURL = os.Getenv(helpers.UAAURLEnvVar)
	ev.APIURL = os.Getenv(helpers.APIURLEnvVar)
	ev.LogURL = os.Getenv(helpers.LogURLEnvVar)

}
