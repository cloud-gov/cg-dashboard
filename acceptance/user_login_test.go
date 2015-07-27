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

	It("should redirect users to login page if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate(testEnvVars.Hostname + "/#/dashboard")).To(Succeed())
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/"))
		})

	})

	It("should manage user authentication", func() {
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

		/*
			By("allowing the user to log out", func() {
				Expect(page.Find("#logout").Click()).To(Succeed())
				Expect(page).To(HavePopupText("Are you sure?"))
				Expect(page.ConfirmPopup()).To(Succeed())
				Eventually(page).Should(HaveTitle("Login"))
			})
		*/
	})

	AfterEach(func() {
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
