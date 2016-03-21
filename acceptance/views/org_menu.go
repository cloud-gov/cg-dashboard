// +build acceptance

package views

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type OrgMenu struct {
	page *agouti.Page
}

func (m OrgMenu) ClickMarketplaceLink() Marketplace {
	Expect(m.page.First(".test-nav-org")).To(BeVisible())
	Eventually(Expect(m.page.FindByLink("Marketplace").Click()).To(Succeed()))
	return Marketplace{m.page}
}

func (m OrgMenu) ClickSpacesLink() Spaces {
	Expect(m.page.First(".test-nav-org")).To(BeVisible())
	Eventually(Expect(m.page.FindByLink("Spaces").Click()).To(Succeed()))
	return Spaces{m.page}
}
