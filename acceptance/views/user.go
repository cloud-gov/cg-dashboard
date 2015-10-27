// +build acceptance

package util

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type User struct {
	testEnvVars AcceptanceTestEnvVars
	username    string
	password    string
}

func StartUserSessionWith(testEnvVars AcceptanceTestEnvVars) User {
	// TODO Add parameter to identify which user to create. Then select which credentials to save.
	user := User{testEnvVars, testEnvVars.Username, testEnvVars.Password}
	return user
}

func (u User) LoginTo(page *agouti.Page) {
	Expect(page.Navigate(u.testEnvVars.Hostname)).To(Succeed())
	Expect(page.Find(".test-login").Click()).To(Succeed())
	Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login"))
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
	Eventually(page.Find("#org-dropdown-btn")).Should(BeVisible())
	Expect(page.Find("#org-dropdown-btn").Click()).To(Succeed())
	return OrgMenu{page}
}

func (u User) OpenDropdownOfOrgsOn(page *agouti.Page) {
	Eventually(page.Find("#orgs-dropdown-btn")).Should(BeVisible())
	Expect(page.Find("#orgs-dropdown-btn").Click()).To(Succeed())
}

func (u User) SelectOrgFromDropdown(page *agouti.Page, orgName string) {
	Eventually(page.Find("#orgs-dropdown-menu")).Should(BeVisible())
	Expect(page.FindByLink(orgName)).To(BeFound())
	Expect(page.FindByLink(orgName).Click()).To(Succeed())
}
