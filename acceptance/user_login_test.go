// +build acceptance

package acceptance

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"net/http/httptest"
)

var _ = Describe("UserLogin", func() {
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

	It("should redirect users to login page if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate(testEnvVars.Hostname + "/#/dashboard")).To(Succeed())
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/"))
		})

	})

	It("should manage user authentication", func() {
		By("directing the user to a landing page", func() {
			Expect(page.Navigate(testEnvVars.Hostname)).To(Succeed())
		})

		By("allowing the user to click the login button and redirected to fill out the login form and submit it", func() {
			delayForRendering()
			Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
			Eventually(Expect(page).To(HaveURL(testEnvVars.LoginURL + "login")))
			Expect(page.FindByName("username").Fill(testEnvVars.Username)).To(Succeed())
			Expect(page.FindByName("password").Fill(testEnvVars.Password)).To(Succeed())
			Expect(page.FindByButton("Sign in").Click()).To(Succeed())
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/dashboard"))
		})

		By("allowing the user to log out", func() {
			Expect(page.Find("#logout").Click()).To(Succeed())
			Eventually(Expect(page).To(HaveURL(testEnvVars.LoginURL + "login")))
		})
	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
