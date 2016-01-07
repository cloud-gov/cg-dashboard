// +build acceptance

package util

import (
	. "github.com/18F/cg-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type App struct {
	page *agouti.Page
}

func (a App) BindToService(serviceName string) {
	// Find the service panel heading.
	xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Expect(a.page.FindByXPath(xPathHeading)).To(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent := xPathHeading + "/parent::*/parent::*"
	panel := a.page.FindByXPath(xPathHeadingGrandparent)
	Eventually(panel).Should(BeFound())
	// Get the button.
	Eventually(panel.Find(".bind-service-btn")).Should(BeFound())
	Expect(panel.Find(".bind-service-btn").Click()).To(Succeed())
	Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", a.page)).NotTo(Equal(nil))
	Expect(FindFirstVisibleOverlayButtonByText("Confirm Bind", a.page).Click()).To(Succeed())
	// Check now that we should see the unbind button.
	// Find the service panel heading.
	xPathHeading = "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Eventually(a.page.FindByXPath(xPathHeading)).Should(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent = xPathHeading + "/parent::*/parent::*"
	panel = a.page.FindByXPath(xPathHeadingGrandparent)
	Eventually(panel).Should(BeFound())
	// Get the button.
	Eventually(panel.Find(".unbind-service-btn")).Should(BeFound())
}

func (a App) UnbindFromService(serviceName string) {
	// Find the service panel heading.
	xPathHeading := "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Eventually(a.page.FindByXPath(xPathHeading)).Should(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent := xPathHeading + "/parent::*/parent::*"
	panel := a.page.FindByXPath(xPathHeadingGrandparent)
	Eventually(panel).Should(BeFound())
	// Get the button.
	Eventually(panel.Find(".unbind-service-btn")).Should(BeFound())
	Expect(panel.Find(".unbind-service-btn").Click()).To(Succeed())
	confirmBtn := FindFirstVisibleOverlayButtonByText("Yes", a.page)
	Expect(confirmBtn).To(BeVisible())
	Expect(confirmBtn.Click()).To(Succeed())
	// Check now that we should see the bind button.
	// Find the service panel heading.
	xPathHeading = "//div[@class='panel panel-default']/div[@class='panel-heading']/*[contains(text(), '" + serviceName + "')]"
	Eventually(a.page.FindByXPath(xPathHeading)).Should(BeFound())
	// Go up two levels to get the whole panel.
	xPathHeadingGrandparent = xPathHeading + "/parent::*/parent::*"
	panel = a.page.FindByXPath(xPathHeadingGrandparent)
	Eventually(panel).Should(BeFound())
	// Get the button.
	Eventually(panel.Find(".bind-service-btn")).Should(BeFound())
}

func (a App) CreateRoute(host string, domain string) {
	// ** Create route and confirm it exists **
	// Fill in the hostname with a dummy route name
	Expect(a.page.FindByName("host").Fill(host)).To(Succeed())
	//Select the domain name
	Expect(a.page.FindByName("domain_guid").Select(domain)).To(Succeed())
	// Click on the create route button
	Expect(a.page.FindByButton("Create Route").Click()).To(Succeed())
	// Clicks on the confirm button
	confirmButton := FindFirstVisibleOverlayButtonByText("Confirm", a.page)
	Expect(confirmButton.Click()).To(Succeed())
	// Check if route exists
	Expect(a.page.FindByName(host + "-" + domain + "-row")).To(BeFound())
}

func (a App) DeleteRoute(host string, domain string) {
	// ** Delete route and confirm that it doesn't exist **
	// Finds and clicks on the delete route button
	Expect(a.page.FindByName(host + "-" + domain + "-delete").Click()).To(Succeed())
	// Find and click the confirm button
	confirmButton := FindFirstVisibleOverlayButtonByText("Confirm", a.page)
	Expect(confirmButton.Click()).To(Succeed())
	// Checks that the route doesn't exist
	Expect(a.page.FindByName(host + "-" + domain + "-row")).ToNot(BeFound())
}
