// +build acceptance

package acceptance

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/18F/cf-deck/helpers"
	"github.com/codeskyblue/go-sh"
	"github.com/gocraft/web"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"fmt"
	"net/http/httptest"
	"os"
	"path"
	"testing"
	"time"
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
	ev.LogURL = os.Getenv(helpers.LogURLEnvVar)

}

// delayForRendering is to allow for test platforms to catch up and render.
func delayForRendering() {
	time.Sleep(helpers.TimeoutConstant)
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

type User struct {
	testEnvVars acceptanceTestEnvVars
	session     *sh.Session
}

func startUserSessionWith(testEnvVars acceptanceTestEnvVars, testAssets testAssetsMap) User {
	// Create multiple CLI sessions on the same computer by setting CF_HOME. https://github.com/cloudfoundry/cli/issues/330#issuecomment-70450866
	user := User{testEnvVars, sh.NewSession().SetEnv("CF_HOME", testAssets[TestUser01])}
	user.LoginToCLI()
	return user
}

func (u User) LoginTo(page *agouti.Page) {
	Expect(page.Navigate(u.testEnvVars.Hostname)).To(Succeed())
	delayForRendering()
	Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
	Eventually(Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login")))
	Expect(page.FindByName("username").Fill(u.testEnvVars.Username)).To(Succeed())
	Expect(page.FindByName("password").Fill(u.testEnvVars.Password)).To(Succeed())
	Expect(page.FindByButton("Sign in").Click()).To(Succeed())
	Expect(page).To(HaveURL(u.testEnvVars.Hostname + "/#/dashboard"))
}

func (u User) LogoutOf(page *agouti.Page) {
	Expect(page.Find("#logout-btn").Click()).To(Succeed())
	Eventually(Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login")))
}

func (u User) LoginToCLI() {
	// Make sure we have signed out
	u.LogoutOfCLI()
	u.session.Command("cf", "api", u.testEnvVars.APIURL).Run()
	// TODO. Will figure out logic for doing multiple accounts once we get them.
	u.session.Command("cf", "auth", u.testEnvVars.Username, u.testEnvVars.Password).Run()
	u.session.Command("cf", "target").Run()
}

func (u User) LogoutOfCLI() {
	u.session.Command("cf", "logout").Run()
}

func TestCfConsole(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "CfConsole Suite")
}

// Create a map type to reference.
// The key will be an enumeration and the value will be a string to represent a path (either relative or absolute)
type testAssetsMap map[testAssetKey]string

// Create the key for the testAssetMap. Essentially an enumeration.
type testAssetKey int

// This enumeration contains all they keys for
// When adding more assets, step 1 of 2 is add another entry here to represent all the entries.
const (
	RootDir testAssetKey = iota
	TestUser01
)

// testAssetsRelPaths contains all the unverified relative paths to tests assets.
// When adding more assets, step 2 of 2 is add another entry here to represent the relative location of the asset with respect to the root test asset folder
var testAssetsRelPaths = testAssetsMap{
	RootDir:    "",
	TestUser01: path.Join("users", "testuser01"),
}

// localTestAssets represents the verified absolute paths of the multiple test assets
var localTestAssets testAssetsMap

// loadTestAssets will verify and create a map of testassets inside of localTestAssets.
func loadTestAssets() testAssetsMap{
	dir, err := os.Getwd()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	dir = path.Join(dir, "test_assets")
	testAssets := make(testAssetsMap)
	for key, relPath := range testAssetsRelPaths {
		absPath := path.Join(dir, relPath)
		if _, err := os.Stat(absPath); err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		testAssets[key] = absPath

	}
	return testAssets
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
