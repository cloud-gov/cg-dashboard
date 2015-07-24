package main_test

import (
	. "github.com/18F/cf-console"
	"github.com/18F/cf-console/helpers"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"os"
)

type AcceptanceTestEnvVars struct {
	helpers.EnvVars
	Username string
	Password string
}

func (ev *AcceptanceTestEnvVars) loadTestEnvVars() {
	ev.Username = os.Getenv("CONSOLE_TEST_USERNAME")
	ev.Password = os.Getenv("CONSOLE_TEST_PASSWORD")
}

var _ = Describe("UserLogin", func() {
	var page *agouti.Page

	testEnvVars := AcceptanceTestEnvVars{LoadEnvVars(), "", ""}
	testEnvVars.loadTestEnvVars()

	BeforeEach(func() {
		var err error
		page, err = agoutiDriver.NewPage()
		StartApp("3000")
		Expect(err).NotTo(HaveOccurred())
	})
	It("should manage user authentication", func() {
		By("redirecting the user to the login form from the home page", func() {
			Expect(page.Navigate("http://localhost:3000/")).To(Succeed())
		})

		By("allowing the user to fill out the login form and submit it", func() {
			// Eventually(page.FindyByLabel("E-mail")).Should(BeFound())
			// Expect(page.FindByLabel("E-mail").Fill("spud@example.com")).To(Succeed())
			// Expect(page.FindByLabel("Password").Fill("secret-password")).To(Succeed())
			Expect(page.Find("#login-btn").Click()).To(Succeed())
			Eventually(Expect(page).To(HaveURL("https://login.18f.gov/login")))
			Expect(page.FindByName("username").Fill(testEnvVars.Username)).To(Succeed())
			Expect(page.FindByName("password").Fill(testEnvVars.Password)).To(Succeed())
			Expect(page.FindByButton("Sign in").Click()).To(Succeed())
			Eventually(Expect(page).To(HaveURL("http://console.18f.gov/#/dashboard")))
		})

		/*
			By("allowing the user to view their profile", func() {
				Eventually(page.FindByLink("Profile Page")).Should(BeFound())
				Expect(page.FindByLink("Profile Page").Click()).To(Succeed())
				profile := page.Find("section.profile")
				Eventually(profile.Find(".greeting")).Should(HaveText("Hello Spud!"))
				Expect(profile.Find("img#profile_pic")).To(BeVisible())
			})

			By("allowing the user to log out", func() {
				Expect(page.Find("#logout").Click()).To(Succeed())
				Expect(page).To(HavePopupText("Are you sure?"))
				Expect(page.ConfirmPopup()).To(Succeed())
				Eventually(page).Should(HaveTitle("Login"))
			})
		*/
	})

	It("should redirect users to login page if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate("http://console.18f.gov/#/dashboard")).To(Succeed())
			Eventually(Expect(page).To(HaveURL("http://console.18f.gov/#/")), 2.0, 1.0)
		})

	})
	AfterEach(func() {
		Expect(page.Destroy()).To(Succeed())
	})
})
