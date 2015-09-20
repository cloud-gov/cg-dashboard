// +build acceptance

package util

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type OrgMenu struct {
	page *agouti.Page
}

func (m OrgMenu) ClickMarketplaceLink() {
	Expect(m.page.Find("#org-dropdown-menu")).To(BeVisible())
	Eventually(Expect(m.page.Find("#org-marketplace").Click()).To(Succeed()))
}

func (m OrgMenu) ClickSpacesLink() Spaces {
	Expect(m.page.Find("#org-dropdown-menu")).To(BeVisible())
	Eventually(Expect(m.page.Find("#org-spaces").Click()).To(Succeed()))
	return Spaces{m.page}
}
