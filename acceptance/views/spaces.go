// +build acceptance

package util

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Spaces struct {
	page *agouti.Page
}

func (s Spaces) ViewSpace(spaceName string) Space {
	DelayForRendering()
	Eventually(Expect(s.page.FindByLink(spaceName)).To(BeFound()))
	Eventually(Expect(s.page.FindByLink(spaceName).Click()).To(Succeed()))
	return Space{s.page}
}

func (s Spaces) ClickUserManagement() Space {
	Eventually(Expect(s.page.FindByLink("User Management")).To(BeFound()))
	Eventually(Expect(s.page.FindByLink("User Management").Click()).To(Succeed()))
	return Space{s.page}
}
