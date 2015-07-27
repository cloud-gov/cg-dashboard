// +build acceptance

package acceptance

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	"github.com/gocraft/web"

	"fmt"
	"net/http/httptest"
	"os"
	"testing"
)

// Helper composite struct to store all the regular env variables as well as the ones for this test suite.
type acceptanceTestEnvVars struct {
	helpers.EnvVars
	Username string
	Password string
}

// Helper function to load all the variables needed.
func (ev *acceptanceTestEnvVars) loadTestEnvVars() {
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

}

// Helper function to handle all the weird work of creating a test server.
func startServer() (*httptest.Server, acceptanceTestEnvVars) {
	// Load the environment variables to conduct the tests.
	testEnvVars := acceptanceTestEnvVars{}
	testEnvVars.loadTestEnvVars()

	var err error
	// Attempt to initial routers
	app, settings, err := controllers.InitApp(testEnvVars.EnvVars)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// Since we are running in a separate folder from the main package, we need to change the location of the static folder.
	app.Middleware(web.StaticMiddleware("../static", web.StaticOption{IndexFile: "index.html"}))

	// Create the httptest server
	server := httptest.NewUnstartedServer(app)
	server.Start()

	// Change config values to fit the URL of the httptest server that is created on a random port.
	testEnvVars.Hostname = server.URL
	settings.OAuthConfig.RedirectURL = server.URL + "/oauth2callback"


	return server, testEnvVars
}

func TestCfConsole(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "CfConsole Suite")
}

var agoutiDriver *agouti.WebDriver

var _ = BeforeSuite(func() {
	// MAKE SURE YOU INSTALL PhantomJS. `brew install phantomjs`
	agoutiDriver = agouti.PhantomJS()

	Expect(agoutiDriver.Start()).To(Succeed())
})

var _ = AfterSuite(func() {
	Expect(agoutiDriver.Stop()).To(Succeed())
})
