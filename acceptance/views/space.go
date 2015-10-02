// +build acceptance

package util

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Space struct {
	page *agouti.Page
}

func (s Space) ViewApp(appName string) App {
	DelayForRendering()
	DelayForRendering()
	Eventually(s.page.FindByLink(appName)).Should(BeFound())
	Expect(s.page.FindByLink(appName).Click()).To(Succeed())
	return App{s.page}
}

func (s Space) ViewServiceInstances() Services {
	DelayForRendering()
	DelayForRendering()
	Eventually(s.page.FindByLink("Service Instances")).Should(BeFound())
	Expect(s.page.FindByLink("Service Instances").Click()).To(Succeed())
	return Services{s.page}
}

func (s Space) ViewsUserManagementTab() {
	DelayForRendering()
	Eventually(s.page.FindByLink("User Management")).Should(BeFound())
	Expect(s.page.FindByLink("User Management").Click()).To(Succeed())
}

func (s Space) getToUserPerms(TestOrgName string, Username string) {
	DelayForRendering()
	Eventually(s.page.FindByLink("All " + TestOrgName + " Org Users")).Should(BeFound())
	DelayForRendering()
	Expect(s.page.FindByLink("All " + TestOrgName + " Org Users").Click()).To(Succeed())
	DelayForRendering()
	DelayForRendering()
	Expect(s.page.FindByLink(Username).Click()).To(Succeed())
}

func (s Space) changeUserPermissions() string {
	devToggle := s.page.Find("#developers")
	Expect(devToggle.Click()).To(Succeed())
	DelayForRendering()
	newState, _ := devToggle.Find(".toggle-switch-animate").Attribute("class")
	return newState
}

func (s Space) ToggleUser(TestOrgName string, Username string) {
	s.getToUserPerms(TestOrgName, Username)
	DelayForRendering()
	// Get the original state
	originalState, _ := s.page.Find("#developers").Find(".toggle-switch-animate").Attribute("class")
	// Toggle the first time
	firstStateChange := s.changeUserPermissions()
	DelayForRendering()
	// Check that the toggle changed
	s.page.Refresh()
	DelayForRendering()
	s.getToUserPerms(TestOrgName, Username)
	DelayForRendering()
	currentState, _ := s.page.Find("#developers").Find(".toggle-switch-animate").Attribute("class")
	Expect(firstStateChange).To(Equal(currentState))
	// Toggle the second time
	s.changeUserPermissions()
	DelayForRendering()
	// Check that the state returned to the original
	s.page.Refresh()
	DelayForRendering()
	s.getToUserPerms(TestOrgName, Username)
	DelayForRendering()
	secondStateChange, _ := s.page.Find("#developers").Find(".toggle-switch-animate").Attribute("class")
	Expect(originalState).To(Equal(secondStateChange))
}
