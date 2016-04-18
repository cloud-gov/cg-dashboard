// +build acceptance

package views

import (
	"fmt"

	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Services struct {
	page *agouti.Page
}

func (s Services) DeleteServiceInstance(instanceName string) {
	var table = s.page.First("table")
	Eventually(table).Should(BeFound())
	var instanceNameCell = table.FirstByXPath(
		fmt.Sprintf("tbody/tr/td/*[.=\"%s\"]", instanceName))
	Eventually(instanceNameCell).Should(BeFound())
	var instance = instanceNameCell.FirstByXPath("ancestor::tr")
	Eventually(instance).Should(BeFound())
	var instanceDeleteAction = instance.First(".test-delete_instance")
	Eventually(instanceDeleteAction).Should(BeFound())
	Expect(instanceDeleteAction.Click()).Should(Succeed())
	// TODO this following check isn't working even though the API says it should.
	//Eventually(instanceNameCell).ShouldNot(BeFound())
}

func (s Services) DeleteBoundServiceInstance(instanceName string) {
	Expect(s.page.Find("#service-instance-search").Fill(instanceName)).To(Succeed())
	Expect(s.page.All(".delete-unbound-service-instance-btn").Count()).To(Equal(1))
	Expect(s.page.First(".delete-unbound-service-instance-btn").Click()).To(Succeed())
	Expect(s.page.FindByButton("Confirm").Click()).To(Succeed())
	Expect(s.page.All(".delete-bound-service-instance-btn").Count()).To(Equal(1))
	Expect(s.page.First(".delete-bound-service-instance-btn").Click()).To(Succeed())
	Expect(s.page.FindByButton("Confirm").Click()).To(Succeed())
}

func (s Services) VerifyServiceInstanceExists(instanceName string) {
	Expect(s.page.Find("#service-instance-search").Fill(instanceName)).To(Succeed())
	Expect(s.page.All(".delete-unbound-service-instance-btn").Count()).To(Equal(1))
}

func (s Services) VerifyServiceInstanceDoesNotExist(instanceName string) {
	Expect(s.page.Find("#service-instance-search").Fill(instanceName)).To(Succeed())
	Expect(s.page.All(".delete-unbound-service-instance-btn").Count()).To(Equal(0))
}
