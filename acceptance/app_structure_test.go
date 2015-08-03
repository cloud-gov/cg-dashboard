// +build acceptance

package acceptance

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	//"fmt"
	"net/http/httptest"
)

var _ = Describe("AppStructure", func() {
	var (
		page        *agouti.Page
		server      *httptest.Server
		testEnvVars acceptanceTestEnvVars
	)

	testEnvVars = acceptanceTestEnvVars{}
	testEnvVars.loadTestEnvVars()

	BeforeEach(func() {
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page = createPage()
	})

	It("should show app structure for an authenticated user", func() {
		By("directing the user to a landing page", func() {
			Expect(page.Navigate(testEnvVars.Hostname)).To(Succeed())
		})

		By("allowing the user to click the login button and redirected to fill out the login form and submit it", func() {
			delayForRendering()
			Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
			Eventually(Expect(page).To(HaveURL(testEnvVars.LoginURL + "/login")))
			Expect(page.FindByName("username").Fill(testEnvVars.Username)).To(Succeed())
			Expect(page.FindByName("password").Fill(testEnvVars.Password)).To(Succeed())
			Expect(page.FindByButton("Sign in").Click()).To(Succeed())
			Eventually(Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/dashboard")))
		})
		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			delayForRendering()
			Expect(page.Find("#org-dropdown")).To(BeFound())
			Expect(page.Find("#org-dropdown").Text()).To(Equal("Organizations "))
			Expect(page.Find("#org-dropdown").Click()).To(Succeed())
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			delayForRendering()
			Eventually(Expect(page.First(".org-name").Click()).To(Succeed()))
		})

		By("showing the table containing spaces", func() {
			delayForRendering()
			Expect(page.Find("#spacesTable")).To(BeFound())
			Expect(page.FindByXPath("//*[@id='spacesTable']/thead/tr/th[1]").Text()).To(Equal("Name"))
			Expect(page.FindByXPath("//*[@id='spacesTable']/thead/tr/th[2]").Text()).To(Equal("Number of Apps"))
			Expect(page.FindByXPath("//*[@id='spacesTable']/thead/tr/th[3]").Text()).To(Equal("Total Development Memory"))
			Expect(page.FindByXPath("//*[@id='spacesTable']/thead/tr/th[4]").Text()).To(Equal("Total Production Memory"))
		})

		By("allowing the user to click on a space in the tab views", func() {
			delayForRendering()
			Eventually(Expect(page.First(".space-info").DoubleClick()).To(Succeed()))
		})

		By("showing app name and quota information (along with other information)", func() {
			delayForRendering()
			Eventually(Expect(page.Find("#app-name-heading")).To(BeFound()))
			Expect(page.Find("#buildpack-heading")).To(BeFound())
			Expect(page.Find("#memory-heading")).To(BeFound())
			Expect(page.Find("#instances-heading")).To(BeFound())
			Expect(page.Find("#state-heading")).To(BeFound())
			Expect(page.Find("#disk-quota-heading")).To(BeFound())

			Expect(page.First(".app-name-data")).To(BeFound())

			Expect(page.First(".buildpack-data")).To(BeFound())

			Expect(page.First(".memory-data")).To(BeFound())

			Expect(page.First(".instances-data")).To(BeFound())

			Expect(page.First(".state-data")).To(BeFound())

			Expect(page.First(".disk-quota-data")).To(BeFound())
		})

		/*
			MARKETPLACE TESTS
		*/
		By("allowing the user to click on the marketplace tab", func() {
			delayForRendering()
			Expect(page.Find("#marketplace").Click()).To(Succeed())
		})

		By("showing the user a table with all the services", func() {
			delayForRendering()
			Expect(page.Find("#service-name-heading")).To(BeFound())
			Expect(page.Find("#service-description-heading")).To(BeFound())
			Expect(page.Find("#service-date-created-heading")).To(BeFound())
			Expect(page.First(".service-name-data")).To(BeFound())
			Expect(page.First(".service-description-data")).To(BeFound())
			Expect(page.First(".service-date-created-data")).To(BeFound())
		})

		By("allowing the user to search for a service", func() {
			delayForRendering()
			rowCountPreSearch, _ := page.All(".service-name-data").Count()
			Expect(page.Find("#serviceSearch").Fill("zzzzzzzzz1111zzz")).To(Succeed())
			Expect(page.All(".service-name-data")).NotTo(HaveCount(rowCountPreSearch))
		})

	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
