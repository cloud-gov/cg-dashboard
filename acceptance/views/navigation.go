// +build acceptance

package views

import (
	"strings"

	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Nav struct {
	page *agouti.Page
	base *agouti.Selection
}

var baseSelector = ".test-nav-primary"

func SetupNav(page *agouti.Page) Nav {
	var nav = page.First(baseSelector)
	Eventually(nav).Should(BeFound())
	return Nav{page, nav}
}

func SetupClickFirstOrg(page *agouti.Page) Nav {
	var nav = SetupNav(page)
	return nav.ClickFirstOrg()
}

func (n Nav) ClickOrg(orgName string) Nav {
	var sel = n.base.FindByLink(strings.ToLower(orgName))
	Eventually(sel).Should(BeFound())
	Expect(sel.Click()).To(Succeed())
	return Nav{n.page, sel}
}

func (n Nav) ClickFirstOrg() Nav {
	Expect(n.base.First(".test-nav-org").Click()).To(Succeed())
	return Nav{n.page, n.base.First(".test-nav-org")}
}

func (n Nav) ClickSpaces() Spaces {
	Expect(n.base.FindByLink("Spaces").Click()).To(Succeed())
	return Spaces{n.page}
}

func (n Nav) ClickOrgSpaces(orgName string) Spaces {
	var orgNav = n.ClickOrg(orgName)
	var currentNavList = orgNav.base.FindByXPath("ancestor::ul")

	var spacesLink = currentNavList.FindByLink("Spaces")

	Eventually(spacesLink).Should(BeFound())
	Eventually(Expect(spacesLink.Click()).To(Succeed()))
	return Spaces{orgNav.page}
}

func (n Nav) ClickOrgMarketplace(orgName string) Marketplace {
	var orgNav = n.ClickOrg(orgName)
	var currentNavList = orgNav.base.FindByXPath("ancestor::ul")
	var marketplaceLink = currentNavList.FindByLink("Marketplace")

	Eventually(marketplaceLink).Should(BeFound())
	Expect(marketplaceLink.Click()).To(Succeed())

	return Marketplace{n.page}
}
