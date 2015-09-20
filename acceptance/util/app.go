// +build acceptance

package util

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type App struct {
	page *agouti.Page
}

func (a App) BindToService() {
	DelayForRendering()
	// Find the service panel heading.
	xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + "testService01" + "')]"
	Expect(a.page.FindByXPath(xPathHeading)).To(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent := xPathHeading + "/parent::*/parent::*"
	panel := a.page.FindByXPath(xPathHeadingGrandparent)
	Expect(panel).To(BeFound())
	// Get the button.
	Expect(panel.Find(".bind-service-btn")).To(BeFound())
	Expect(panel.Find(".bind-service-btn").Click()).To(Succeed())
	Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", a.page)).NotTo(Equal(nil))
	Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", a.page).Click()).To(Succeed())
}
