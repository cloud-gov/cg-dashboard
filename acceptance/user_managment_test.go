// +build acceptance

package acceptance

import (
	"fmt"
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/18F/cf-deck/acceptance/views"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"net/http/httptest"
)

var _ = Describe("UserManagement", func() {
	var (
		page        *agouti.Page
		server      *httptest.Server
		testEnvVars AcceptanceTestEnvVars
		spaces      Spaces
		user        User
		nav         Nav
		testOrg     string
		testSpace   string
	)

	testEnvVars = AcceptanceTestEnvVars{}
	testEnvVars.LoadTestEnvVars()
	testOrg = "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250"
	testSpace = "b7e56bba-b01b-4c14-883f-2e6d15284b58"

	BeforeEach(func() {
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page = createPage()

		// Create user
		user = StartUserSessionWith(testEnvVars)

		// Log user in
		user.LoginTo(page)

		// Get a nav resource
		nav = SetupNav(page)
	})

	It("should allow a space manager to see a list of users for a space", func() {
		By("allowing user to click on spaces in an org the navigation", func() {
			spaces = nav.ClickOrgSpaces(testEnvVars.TestOrgName)
		})

		By("allowing user to click on a certain space", func() {
			spaces.ViewSpace(testEnvVars.TestSpaceName)
		})

		By("having the active tab set to default space users", func() {
			Expect(page).To(HaveURL(fmt.Sprintf(testEnvVars.Hostname+
				"/#/org/%s/spaces/%s/users", testOrg, testSpace)))
			Eventually(Expect(page.First(".test-subnav-users")).Should(BeVisible()))
			Eventually(Expect(page.First(".test-subnav-users .active").Text()).To(Equal("Current space users")))
		})

		By("seeing a user list for spaces on the first page by default", func() {
			Eventually(Expect(page.First(".table")).Should(BeVisible()))
			Eventually(Expect(page.First(".table tbody tr")).Should(BeVisible()))
		})
	})

	It("should allow a org manager to see a list of users for an org", func() {
		By("allowing the user to navigate to the space users page", func() {
			Expect(page.Navigate(fmt.Sprintf(testEnvVars.Hostname+
				"/#/org/%s/spaces/%s/users",
				testOrg, testSpace))).To(Succeed())
		})

		By("allowing the user to navigate to the all org users page", func() {
			Expect(page.FindByLink("All organization users")).Should(BeVisible())
			Expect(page.FindByLink("All organization users").Click()).To(Succeed())
		})
	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
