// +build acceptance

package views

import (
	"fmt"
	. "github.com/18F/cg-dashboard/acceptance/util"
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
	Expect(page.Navigate(u.testEnvVars.Hostname + "/#/")).To(Succeed())
	var loginLink = page.First(".test-login")
	Eventually(loginLink).Should(BeFound())
	Expect(loginLink.Click()).To(Succeed())
	Eventually(page).Should(HaveURL(u.testEnvVars.LoginURL + "login"))
	Expect(page.FindByName("username").Fill(u.username)).To(Succeed())
	Expect(page.FindByName("password").Fill(u.password)).To(Succeed())
	Expect(page.FindByButton("Sign in").Click()).To(Succeed())
	Eventually(page.FindByButton("Authorize").Click())
	Eventually(page).Should(HaveURL(u.testEnvVars.Hostname + "/#/dashboard"))
}

func (u User) LogoutOf(page *agouti.Page) {
	Expect(page.Navigate(u.testEnvVars.Hostname + "/v2/logout")).To(Succeed())
	/*
		Expect(page.Find("#logout-btn").Click()).To(Succeed())
		Eventually(Expect(page).To(HaveURL(u.testEnvVars.LoginURL + "login")))
	*/
}

func (u User) GetPermission(userRow *agouti.Selection, permission string) *agouti.Selection {
	var userPerms = userRow.FindByXPath("following-sibling::*[1]")
	Eventually(userPerms).Should(BeFound())
	var userPerm = userPerms.FindByXPath(fmt.Sprintf("td/div/span/span/*[.=\"%s\"]",
		permission))
	Eventually(userPerm).Should(BeFound())
	var userPermRow = userPerm.FirstByXPath("ancestor::span")
	Eventually(userPermRow).Should(BeFound())
	var userPermCheckbox = userPermRow.Find("input")
	Eventually(userPermCheckbox).Should(BeFound())

	return userPermCheckbox
}

func (u User) ActivatePermission(userRow *agouti.Selection, permission string) *agouti.Selection {
	var userPermCheckbox = u.GetPermission(userRow, permission)
	Expect(userPermCheckbox.Check()).To(Succeed())

	return userPermCheckbox
}

func (u User) DeactivatePermission(userRow *agouti.Selection, permission string) *agouti.Selection {
	var userPermCheckbox = u.GetPermission(userRow, permission)
	Expect(userPermCheckbox.Uncheck()).To(Succeed())

	return userPermCheckbox
}
