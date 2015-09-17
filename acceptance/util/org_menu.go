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
	DelayForRendering()
	Expect(m.page.Find("#org-dropdown-menu")).To(BeVisible())
	Eventually(Expect(m.page.Find("#org-marketplace").Click()).To(Succeed()))
}
