// +build acceptance

package acceptance

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/18F/cf-deck/acceptance/views"
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
	})

	It("should show the login form if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate(testEnvVars.Hostname + "/#/dashboard")).To(Succeed())
			Expect(page.Find(".test-login")).Should(BeVisible())
		})

	})

	It("should manage user authentication", func() {
		By("directing the user to a landing page", func() {
			Expect(page.Navigate(testEnvVars.Hostname)).To(Succeed())
		})

		By("allowing the user to click the login button and redirected to fill out the login form and submit it", func() {
			user.LoginTo(page)
		})

		By("allowing the user to log out", func() {
			user.LogoutOf(page)
		})
	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
