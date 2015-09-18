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
		service     Service
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

		// Init service
		service = InitService("testService01", testEnvVars, user)
	})
	It("should allow a user to create a service instance", func() {
		Skip("")
		By("creating a service", func() {
			service.CreateService(page)
		})
	})

	It("should allow a user to delete a service instance", func() {
		Skip("")
		By("deleting a service", func() {
			service.DeleteUnboundService(page)
		})

	})

	It("should allow a user to create a service instance and bind it to an app.", func() {
		Skip("")
		By("creating a service", func() {
			service.CreateService(page)
		})
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
		By("going to the app page", func() {
			DelayForRendering()
			Expect(page.FindByLink(testEnvVars.TestAppName)).To(BeFound())
			Eventually(Expect(page.FindByLink(testEnvVars.TestAppName).Click()).To(Succeed()))
		})
		By("binding the service to the app", func() {
			DelayForRendering()
			// Find the service panel heading.
			xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '"+"testService01"+"')]"
			Expect(page.FindByXPath(xPathHeading)).To(BeFound())
			// Go up two levels to get the whole panel.
			xPathHeadingGrandparent := xPathHeading + "/parent::*/parent::*"
			panel := page.FindByXPath(xPathHeadingGrandparent)
			Expect(panel).To(BeFound())
			// Get the button.
			Expect(panel.Find(".bind-service-btn")).To(BeFound())
			Expect(panel.Find(".bind-service-btn").Click()).To(Succeed())
			DelayForRendering()
			Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", page)).NotTo(Equal(nil))
			Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", page).Click()).To(Succeed())
			DelayForRendering()
		})
	})
	It("should allow a user to delete a service instance", func() {
		By("deleting a service", func() {
			service.DeleteUnboundService(page)
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
