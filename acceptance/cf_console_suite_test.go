// +build acceptance

package acceptance

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	"github.com/gocraft/web"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"

	"fmt"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

// Helper composite struct to store all the regular env variables as well as the ones for this test suite.
type acceptanceTestEnvVars struct {
	helpers.EnvVars
	Username string
	Password string
	Org01    string
}

// Helper function to load all the variables needed.
func (ev *acceptanceTestEnvVars) loadTestEnvVars() {
	ev.Username = os.Getenv("CONSOLE_TEST_USERNAME")
	ev.Password = os.Getenv("CONSOLE_TEST_PASSWORD")
	ev.Org01 = os.Getenv("CONSOLE_TEST_ORG1")

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

// delayForRendering is to allow for test platforms to catch up and render.
func delayForRendering() {
	time.Sleep(1 * time.Second)
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

func createPage() *agouti.Page {
	// Create a fresh page to navigate.
	page, err := agoutiDriver.NewPage()
	Expect(err).NotTo(HaveOccurred())
	// PhantomJS makes the window really small. For now, these tests will be for desktop sizes.
	page.Size(1024, 768)
	Expect(err).NotTo(HaveOccurred())
	page.ClearCookies()
	return page
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
