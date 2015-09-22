// +build acceptance

package util
import (
	. "github.com/18F/cf-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Space struct {
	page *agouti.Page
}

func (s Space) ViewApp(appName string) App {
	DelayForRendering()
	DelayForRendering()
	Eventually(s.page.FindByLink(appName)).Should(BeFound())
	Expect(s.page.FindByLink(appName).Click()).To(Succeed())
	return App{s.page}
}

func (s Space) ViewServiceInstances() Services {
	DelayForRendering()
	DelayForRendering()
	Eventually(s.page.FindByLink("Service Instances")).Should(BeFound())
	Expect(s.page.FindByLink("Service Instances").Click()).To(Succeed())
	return Services{s.page}
}
