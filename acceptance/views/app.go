// +build acceptance

package util

import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type App struct {
	page *agouti.Page
}

func (a App) BindToService(serviceName string) {
	DelayForRendering()
	// Find the service panel heading.
	xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
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
	// Check now that we should see the unbind button.
	DelayForRendering()
	// Find the service panel heading.
	xPathHeading = "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Expect(a.page.FindByXPath(xPathHeading)).To(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent = xPathHeading + "/parent::*/parent::*"
	panel = a.page.FindByXPath(xPathHeadingGrandparent)
	Expect(panel).To(BeFound())
	// Get the button.
	Expect(panel.Find(".unbind-service-btn")).To(BeFound())
}

func (a App) UnbindFromService(serviceName string) {
	DelayForRendering()
	// Find the service panel heading.
	xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Expect(a.page.FindByXPath(xPathHeading)).To(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent := xPathHeading + "/parent::*/parent::*"
	panel := a.page.FindByXPath(xPathHeadingGrandparent)
	Expect(panel).To(BeFound())
	// Get the button.
	Expect(panel.Find(".unbind-service-btn")).To(BeFound())
	Expect(panel.Find(".unbind-service-btn").Click()).To(Succeed())
	confirmBtn := FindFirstVisibleOverlayButtonByText("Yes", a.page)
	Expect(confirmBtn).To(BeVisible())
	Expect(confirmBtn.Click()).To(Succeed())
	// Check now that we should see the bind button.
	DelayForRendering()
	// Find the service panel heading.
	xPathHeading = "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Expect(a.page.FindByXPath(xPathHeading)).To(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent = xPathHeading + "/parent::*/parent::*"
	panel = a.page.FindByXPath(xPathHeadingGrandparent)
	Expect(panel).To(BeFound())
	// Get the button.
	Expect(panel.Find(".bind-service-btn")).To(BeFound())
}
