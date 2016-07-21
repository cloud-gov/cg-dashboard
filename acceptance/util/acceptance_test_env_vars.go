// +build acceptance

package util

import (
	"fmt"
	"github.com/18F/cg-dashboard/helpers"
	"os"
)

// Helper composite struct to store all the regular env variables as well as the ones for this test suite.
type AcceptanceTestEnvVars struct {
	helpers.EnvVars
	Username      string
	Password      string
	TestOrgName   string
	TestSpaceName string
	TestAppName   string
	TestDomain    string
	TestHost      string
}

// Helper function to load all the variables needed.
func (ev *AcceptanceTestEnvVars) LoadTestEnvVars() {
	ev.Username = os.Getenv("CONSOLE_TEST_USERNAME")
	ev.Password = os.Getenv("CONSOLE_TEST_PASSWORD")
	ev.TestOrgName = os.Getenv("CONSOLE_TEST_ORG_NAME")
	ev.TestSpaceName = os.Getenv("CONSOLE_TEST_SPACE_NAME")
	ev.TestAppName = os.Getenv("CONSOLE_TEST_APP_NAME")
	ev.TestDomain = os.Getenv("CONSOLE_TEST_DOMAIN")
	ev.TestHost = os.Getenv("CONSOLE_TEST_HOST")

	if len(ev.Username) < 1 {
		fmt.Println("Please set CONSOLE_TEST_USERNAME")
		os.Exit(1)
	}

	if len(ev.Password) < 1 {
		fmt.Println("Please set CONSOLE_TEST_PASSWORD")
		os.Exit(1)
	}

	if len(ev.TestOrgName) < 1 {
		fmt.Println("Please set CONSOLE_TEST_ORG_NAME")
		os.Exit(1)
	}

	if len(ev.TestSpaceName) < 1 {
		fmt.Println("Please set CONSOLE_TEST_SPACE_NAME")
		os.Exit(1)
	}

	if len(ev.TestAppName) < 1 {
		fmt.Println("Please set CONSOLE_TEST_APP_NAME")
		os.Exit(1)
	}

	if len(ev.TestHost) < 1 {
		fmt.Println("Please set CONSOLE_TEST_HOST")
		os.Exit(1)
	}

	if len(ev.TestDomain) < 1 {
		fmt.Println("Please set CONSOLE_TEST_DOMAIN")
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
