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

func (u User) OpenOrgMenuOn(page *agouti.Page) OrgMenu {
	Expect(page.Find("#org-dropdown-btn")).To(BeVisible())
	Expect(page.Find("#org-dropdown-btn").Click()).To(Succeed())
	return OrgMenu{page}
}

func (u User) OpenDropdownOfOrgsOn(page *agouti.Page) {
	Expect(page.Find("#orgs-dropdown-btn")).To(BeVisible())
	Expect(page.Find("#orgs-dropdown-btn").Click()).To(Succeed())
}

func (u User) SelectOrgFromDropdown(page *agouti.Page, orgName string) {
	Expect(page.Find("#orgs-dropdown-menu")).To(BeVisible())
	Expect(page.FindByLink(orgName)).To(BeFound())
	Eventually(Expect(page.FindByLink(orgName).Click()).To(Succeed()))
}
