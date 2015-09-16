// +build acceptance

package util

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type User struct {
	testEnvVars AcceptanceTestEnvVars
	username string
	password string
}

func StartUserSessionWith(testEnvVars AcceptanceTestEnvVars) User {
	// TODO Add parameter to identify which user to create. Then select which credentials to save.
	user := User{testEnvVars, testEnvVars.Username, testEnvVars.Password}
	return user
}

func (u User) LoginTo(page *agouti.Page) {
	Expect(page.Navigate(u.testEnvVars.Hostname)).To(Succeed())
	DelayForRendering()
	Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
	Eventually(Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login")))
	Expect(page.FindByName("username").Fill(u.username)).To(Succeed())
	Expect(page.FindByName("password").Fill(u.password)).To(Succeed())
	Expect(page.FindByButton("Sign in").Click()).To(Succeed())
	Expect(page).To(HaveURL(u.testEnvVars.Hostname + "/#/dashboard"))
}

func (u User) LogoutOf(page *agouti.Page) {
	Expect(page.Find("#logout-btn").Click()).To(Succeed())
	Eventually(Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login")))
}
