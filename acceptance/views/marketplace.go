// +build acceptance

package util

import (
	"fmt"

	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Marketplace struct {
	page *agouti.Page
}

type Service struct {
	page       *agouti.Page
	ServiceRow *agouti.Selection
	PlanList   *agouti.Selection
}

func (m Marketplace) FindService(serviceType string) Service {
	var table = m.page.First(".table")
	Eventually(table).Should(BeFound())
	var rows = table.First("tbody tr")
	Eventually(rows).Should(BeFound())
	Expect(rows.Count()).Should(BeNumerically(">=", 1))
	var serviceSel = table.FindByXPath(fmt.Sprintf(
		"tbody/tr/td/*[.=\"%s\"]", serviceType))
	Eventually(serviceSel).Should(BeFound())
	var row = serviceSel.FindByXPath("ancestor::tr")
	var planList = serviceSel.FindByXPath("ancestor::tr/following-sibling::*[1]")
	Eventually(row).Should(BeFound())
	Eventually(planList).Should(BeFound())
	planList = planList.Find(".table")
	var service = Service{
		m.page,
		row,
		planList,
	}
	return service
}

func (s Service) CreateService(servicePlan string, instanceName string,
	spaceName string) {
	var planName = s.PlanList.FirstByXPath(
		fmt.Sprintf("tbody/tr/td/*[.=\"%s\"]", servicePlan))
	Eventually(planName).Should(BeFound())
	var planRow = planName.FirstByXPath("ancestor::tr")
	Eventually(planRow).Should(BeFound())
	var planCreateAction = planRow.First(".test-create_service_instance")
	Eventually(planCreateAction).Should(BeFound())
	Expect(planCreateAction.Click()).Should(Succeed())
	var createForm = s.page.First(".test-create_service_instance_form")
	Eventually(createForm).Should(BeFound())
	var nameField = createForm.First(".test-create_service_instance_name")
	var spaceSelect = createForm.First(".test-create_service_instance_space")
	Expect(nameField.Fill(instanceName)).To(Succeed())
	Expect(spaceSelect.Select(spaceName)).To(Succeed())
	Expect(createForm.Submit()).To(Succeed())
}

func (m Marketplace) CreateService(serviceType string, servicePlan string,
	serviceName string, spaceName string) {
}
