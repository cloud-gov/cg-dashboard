package main_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

var _ = Describe("UserLogin", func() {
	var page *agouti.Page

	BeforeEach(func() {
		var err error
		page, err = agoutiDriver.NewPage()
		Expect(err).NotTo(HaveOccurred())
	})
	It("should manage user authentication", func() {
		By("redirecting the user to the login form from the home page", func() {
			Expect(page.Navigate("http://console.18f.gov/#/dashboard")).To(Succeed())
			Expect(page).To(HaveURL("http://console.18f.gov/login"))
		})

		By("allowing the user to fill out the login form and submit it", func() {
			// Eventually(page.FindyByLabel("E-mail")).Should(BeFound())
			// Expect(page.FindByLabel("E-mail").Fill("spud@example.com")).To(Succeed())
			// Expect(page.FindByLabel("Password").Fill("secret-password")).To(Succeed())
			Expect(page.Find("#remember_me").Check()).To(Succeed())
			Expect(page.Find("#login_form").Submit()).To(Succeed())
		})

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
	})

	It("should redirect users to login page if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate("http://console.18f.gov/#/dashboard")).To(Succeed())
			Expect(page).To(HaveURL("https://login.18f.gov/login"))
		})

	})
	AfterEach(func() {
		Expect(page.Destroy()).To(Succeed())
	})
})
