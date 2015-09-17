// +build acceptance

package acceptance

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"net/http/httptest"
)

var _ = Describe("AppStructure", func() {
	var (
		page        *agouti.Page
		server      *httptest.Server
		testEnvVars AcceptanceTestEnvVars
		user        User
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
		By("Navigate to the org page", func() {
			user.OpenDropdownOfOrgsOn(page)
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			user.SelectOrgFromDropdown(page, testEnvVars.TestOrgName)
		})

		By("allowing the user to click on a space in the tab views", func() {
			DelayForRendering()
			Expect(page.FindByLink(testEnvVars.TestSpaceName)).To(BeFound())
			Eventually(Expect(page.FindByLink(testEnvVars.TestSpaceName).Click()).To(Succeed()))
		})

		By("allowing the user to click on an app in the tab views", func() {
			DelayForRendering()
			Expect(page.FindByLink(testEnvVars.TestAppName)).To(BeFound())
			Eventually(Expect(page.FindByLink(testEnvVars.TestAppName).Click()).To(Succeed()))
			DelayForRendering()
		})

		By("allowing the user to fill in a host route", func() {
			DelayForRendering()
			Expect(page.FindByName("host").Fill("testtestest")).To(Succeed())
		})

		By("allowing the user to select a domain", func() {
			selection := page.FindByName("domain_guid")
			Expect(selection.Select("18f.gov")).To(Succeed())
			DelayForRendering()
		})

		By("allowing the user to create a route by submitting the form", func() {
			Expect(page.FindByButton("Create Route").Click()).To(Succeed())
			DelayForRendering()
			Expect(page.FindByButton("Confirm Route").Click()).To(Succeed())
			DelayForRendering()
		})

		By("showing the route that was created", func() {
			DelayForRendering()
			Expect(page.FindByName("testtestest-row")).To(BeFound())
		})

		By("allowing user to click on the delete button", func() {
			DelayForRendering()
			Expect(page.FindByName("testtestest-delete").Click()).To(Succeed())
		})

		By("allowing user to confirm the deletion", func() {
			DelayForRendering()
			Expect(page.FindByButton("Delete testtestest").Click()).To(Succeed())
		})

		By("removing the deleted route form the page user", func() {
			DelayForRendering()
			Expect(page.FindByName("testtestest-row")).NotTo(BeFound())

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
