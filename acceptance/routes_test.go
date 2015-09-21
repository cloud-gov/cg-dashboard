// +build acceptance

package acceptance

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/18F/cf-deck/acceptance/views"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	"net/http/httptest"
)

var _ = Describe("AppStructure", func() {
	var (
		user        User
		page        *agouti.Page
		server      *httptest.Server
		testEnvVars AcceptanceTestEnvVars
		spaces      Spaces
		space       Space
		app         App
	)

	testEnvVars = AcceptanceTestEnvVars{}
	testEnvVars.LoadTestEnvVars()

	BeforeEach(func() {
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page = createPage()

		// Create user
		user = StartUserSessionWith(testEnvVars)

		// Log user in
		user.LoginTo(page)
	})

	It("Allow the user to create and destroy app routes", func() {
		By("going to the app page", func() {
			user.OpenDropdownOfOrgsOn(page)
			user.SelectOrgFromDropdown(page, testEnvVars.TestOrgName)
			spaces = user.OpenOrgMenuOn(page).ClickSpacesLink()
			space = spaces.ViewSpace(testEnvVars.TestSpaceName)
			app = space.ViewApp(testEnvVars.TestAppName)
		})

		By("allowing the user to create a route", func() {
			// Create a route
			app.CreateRoute(testEnvVars.TestHost, testEnvVars.TestDomain)
		})

		By("allowing the user to delete a route", func() {
			// Delete the route
			app.DeleteRoute(testEnvVars.TestHost, testEnvVars.TestDomain)
		})

	})

	AfterEach(func() {
		// Logout user
		user.LogoutOf(page)
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
