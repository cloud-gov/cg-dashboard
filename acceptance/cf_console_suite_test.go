package main_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"

	"testing"
)

func TestCfConsole(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "CfConsole Suite")
}

var agoutiDriver *agouti.WebDriver

var _ = BeforeSuite(func() {

	// MAKE SURE YOU INSTALL PhantomJS. `brew install phantomjs`
	agoutiDriver = agouti.PhantomJS()

	Expect(agoutiDriver.Start()).To(Succeed())
})

var _ = AfterSuite(func() {
	Expect(agoutiDriver.Stop()).To(Succeed())
})
