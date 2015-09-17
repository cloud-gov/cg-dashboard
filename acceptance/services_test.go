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

var _ = Describe("Services", func() {
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
	It("should allow a user to create a service instance", func() {
		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			user.OpenDropdownOfOrgsOn(page)
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			user.SelectOrgFromDropdown(page, testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org marketplace in the org dropdown menu", func() {
			user.OpenOrgMenuOn(page).ClickMarketplaceLink()
		})
		By("allowing the user to click the Service Name called 'rds'", func() {
			DelayForRendering()
			Expect(page.FindByLink("rds")).To(BeFound())
			Eventually(Expect(page.FindByLink("rds").Click()).To(Succeed()))
		})

		By("finding the shared-psql plan row", func() {
			Expect(page.Find("#servicePlanSearch").Fill("shared-psql")).To(Succeed())
			Expect(page.All(".create-service-btn").Count()).To(Equal(1))
		})
		By("creating the service and showing 'Service Created' to confirm creatiion", func() {
			Expect(page.First(".create-service-btn").Click()).To(Succeed())
			Expect(page.Find("#new-service-name").Fill("testService01")).To(Succeed())
			selection := page.Find("#target-space")
			Expect(selection.Select(testEnvVars.TestSpaceName)).To(Succeed())
			Eventually(Expect(page.First("#confirm-create-service-btn").Click()).To(Succeed()))
			DelayForRendering()
			Expect(page.Find("#message-alert-service")).To(HaveText("Service Created!"))
		})
	})

	It("should allow a user to delete a service instance", func() {
		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			user.OpenDropdownOfOrgsOn(page)
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			user.SelectOrgFromDropdown(page, testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org spaces in the org dropdown menu", func() {
			user.OpenOrgMenuOn(page).ClickSpacesLink()
		})
		By("allowing the user to click the on test space", func() {
			DelayForRendering()
			Expect(page.FindByLink(testEnvVars.TestSpaceName)).To(BeFound())
			Eventually(Expect(page.FindByLink(testEnvVars.TestSpaceName).Click()).To(Succeed()))
		})
		By("allowing the user to click the on test service instances tab", func() {
			DelayForRendering()
			Expect(page.FindByLink("Service Instances")).To(BeFound())
			Eventually(Expect(page.FindByLink("Service Instances").Click()).To(Succeed()))
		})
		By("finding the unbound service instance and delete it", func() {
			DelayForRendering()
			Expect(page.Find("#service-instance-search").Fill("testService01")).To(Succeed())
			Expect(page.All(".delete-unbound-service-instance-btn").Count()).To(Equal(1))
			Expect(page.First(".delete-unbound-service-instance-btn").Click()).To(Succeed())
			Expect(page.FindByButton("Confirm").Click()).To(Succeed())
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
