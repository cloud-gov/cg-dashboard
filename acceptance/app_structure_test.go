package acceptance

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"net/http/httptest"
)

var _ = Describe("AppStructure", func() {
	var (
		page   *agouti.Page
		server *httptest.Server
		testEnvVars acceptanceTestEnvVars
	)

	testEnvVars = acceptanceTestEnvVars{}
	testEnvVars.loadTestEnvVars()

	BeforeEach(func() {
		var err error
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page, err = agoutiDriver.NewPage()
		Expect(err).NotTo(HaveOccurred())
		page.ClearCookies()
	})

	It("should show app structure for an authenticated user", func() {
		By("redirecting the user to the login form from the home page", func() {
			Expect(page.Navigate(testEnvVars.Hostname)).To(Succeed())
		})

		By("allowing the user to fill out the login form and submit it", func() {
			Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
			Eventually(Expect(page).To(HaveURL(testEnvVars.LoginURL + "/login")))
			Expect(page.FindByName("username").Fill(testEnvVars.Username)).To(Succeed())
			Expect(page.FindByName("password").Fill(testEnvVars.Password)).To(Succeed())
			Expect(page.FindByButton("Sign in").Click()).To(Succeed())
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/dashboard"))
		})

		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			Expect(page.Find("#org-dropdown").Text()).To(Equal("Organizations "))
			Expect(page.Find("#org-dropdown").Click()).To(Succeed())
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			Expect(page.First(".org-name").Click()).To(Succeed())
		})

		By("allowing the user to click on a space in the tab views", func() {
			Expect(page.First(".space-name").Click()).To(Succeed())
		})

		By("showing app name and quota information (along with other information)", func() {
			Expect(page.Find("#app-name-heading")).To(BeFound())
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
	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
