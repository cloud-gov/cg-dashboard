// +build acceptance

package util
import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Service struct {
	serviceName string
	testEnvVars AcceptanceTestEnvVars
	user User
}

func InitService(serviceName string, testEnvVars AcceptanceTestEnvVars, user User) Service {
	return Service{serviceName, testEnvVars, user}
}

func (s Service) CreateService(page *agouti.Page) {
		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			s.user.OpenDropdownOfOrgsOn(page)
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			s.user.SelectOrgFromDropdown(page, s.testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org marketplace in the org dropdown menu", func() {
			s.user.OpenOrgMenuOn(page).ClickMarketplaceLink()
		})
		By("allowing the user to click the Service Name called 'rds'", func() {
			DelayForRendering()
			Expect(page.FindByLink("rds")).To(BeFound())
			Eventually(Expect(page.FindByLink("rds").Click()).To(Succeed()))
		})

		By("finding the shared-psql plan row", func() {
			Expect(page.Find("#servicePlanSearch").Fill("shared-psql")).To(Succeed())
			Expect(page.All(".create-service-btn").Count()).To(Equal(1))
		})
		By("creating the service and showing 'Service Created' to confirm creatiion", func() {
			Expect(page.First(".create-service-btn").Click()).To(Succeed())
			Expect(page.Find("#new-service-name").Fill("testService01")).To(Succeed())
			selection := page.Find("#target-space")
			Expect(selection.Select(s.testEnvVars.TestSpaceName)).To(Succeed())
			Eventually(Expect(page.First("#confirm-create-service-btn").Click()).To(Succeed()))
			DelayForRendering()
			Expect(page.Find("#message-alert-service")).To(HaveText("Service Created!"))
		})
}

func (s Service) DeleteBoundService(page *agouti.Page) {
	s.deleteService(".delete-bound-service-instance-btn", page)
}

func (s Service) DeleteUnboundService(page *agouti.Page) {
	s.deleteService(".delete-unbound-service-instance-btn", page)
}

func (s Service) deleteService(delete_button_id string, page *agouti.Page) {
		By("allowing the user to click a dropdown menu labeled 'Organizations'", func() {
			s.user.OpenDropdownOfOrgsOn(page)
		})

		By("allowing the user to click on an organization in the dropdown menu", func() {
			s.user.SelectOrgFromDropdown(page, s.testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org spaces in the org dropdown menu", func() {
			s.user.OpenOrgMenuOn(page).ClickSpacesLink()
		})
		By("allowing the user to click the on test space", func() {
			DelayForRendering()
			Expect(page.FindByLink(s.testEnvVars.TestSpaceName)).To(BeFound())
			Eventually(Expect(page.FindByLink(s.testEnvVars.TestSpaceName).Click()).To(Succeed()))
		})
		By("allowing the user to click the on test service instances tab", func() {
			DelayForRendering()
			Expect(page.FindByLink("Service Instances")).To(BeFound())
			Eventually(Expect(page.FindByLink("Service Instances").Click()).To(Succeed()))
		})
		By("finding the unbound service instance and delete it", func() {
			DelayForRendering()
			Expect(page.Find("#service-instance-search").Fill("testService01")).To(Succeed())
			Expect(page.All(delete_button_id).Count()).To(Equal(1))
			Expect(page.First(delete_button_id).Click()).To(Succeed())
			Expect(page.FindByButton("Confirm").Click()).To(Succeed())
		})
		By("verifying that the service is gone", func() {
			Expect(page.Refresh()).To(Succeed())
			DelayForRendering()
			Expect(page.Find("#service-instance-search").Fill("testService01")).To(Succeed())
			Expect(page.All(delete_button_id).Count()).To(Equal(0))

		})
}
