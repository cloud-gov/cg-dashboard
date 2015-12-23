// +build acceptance

package util

import (
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Marketplace struct {
	page *agouti.Page
}

func (m Marketplace) CreateService(serviceType string, servicePlan string, serviceName string, spaceName string) {
	Expect(m.page.FindByLink(serviceType)).To(BeFound())
	Eventually(Expect(m.page.FindByLink(serviceType).Click()).To(Succeed()))
	Expect(m.page.Find("#servicePlanSearch").Fill(servicePlan)).To(Succeed())
	Expect(m.page.All(".create-service-btn").Count()).To(Equal(1))
	Expect(m.page.First(".create-service-btn").Click()).To(Succeed())
	Expect(m.page.Find("#new-service-name").Fill(serviceName)).To(Succeed())
	selection := m.page.Find("#target-space")
	Expect(selection.Select(spaceName)).To(Succeed())
	Eventually(Expect(m.page.First("#confirm-create-service-btn").Click()).To(Succeed()))
	Expect(m.page.Find("#message-alert-service")).To(HaveText("Service Created!"))
}
