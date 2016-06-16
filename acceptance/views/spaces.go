// +build acceptance

package util
import (
	. "github.com/18F/cg-deck/acceptance/util"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
)

type Spaces struct {
	page *agouti.Page
}

func (s Spaces) ViewSpace(spaceName string) Space {
	DelayForRendering()
	Expect(s.page.FindByLink(spaceName)).To(BeFound())
	Eventually(Expect(s.page.FindByLink(spaceName).Click()).To(Succeed()))
	DelayForRendering()
	return Space{s.page}
}
