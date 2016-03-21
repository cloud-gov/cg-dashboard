// +build acceptance

package views

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Spaces struct {
	page *agouti.Page
}

func (s Spaces) ViewSpace(spaceName string) Space {
	Eventually(s.page.FindByLink(spaceName)).Should(BeFound())
	Expect(s.page.FindByLink(spaceName).Click()).To(Succeed())
	return Space{s.page}
}

func (s Spaces) ClickUserManagement() Space {
	var userManagementLink = s.page.FindByLink("User Management")
	Eventually(userManagementLink).Should(BeFound())
	Expect(userManagementLink.Click()).To(Succeed())
	return Space{s.page}
}
