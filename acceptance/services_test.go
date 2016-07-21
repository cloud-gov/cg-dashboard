// +build acceptance

package acceptance

import (
	. "github.com/18F/cg-dashboard/acceptance/util"
	. "github.com/18F/cg-dashboard/acceptance/views"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"
	"net/http/httptest"
)

var _ = Describe("Services", func() {
	var (
		page             *agouti.Page
		server           *httptest.Server
		testEnvVars      AcceptanceTestEnvVars
		user             User
		nav              Nav
		spaces           Spaces
		space            Space
		services         Services
		app              App
		marketplace      Marketplace
		testInstanceName string
	)

	testInstanceName = "testService02"
	testEnvVars = AcceptanceTestEnvVars{}
	testEnvVars.LoadTestEnvVars()

	BeforeEach(func() {
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page = createPage()

		// Create user
		user = StartUserSessionWith(testEnvVars)

		// Log user in
		user.LoginTo(page)

		// Get a nav resource
		nav = SetupNav(page)
	})

	It("should allow an org manager to see a list of services", func() {
		By("allowing the manager to click on the org marketplace in navigation", func() {
			marketplace = nav.ClickOrgMarketplace(testEnvVars.TestOrgName)
		})

		By("allowing the manager to see a lists of services", func() {
			var service = marketplace.FindService("rds")
			Expect(service.ServiceRow.First("td")).To(HaveText("rds"))
		})
	})

	It("should allow an org manager to see a list of service plans for services", func() {
		var service Service

		By("allowing the manager to click on the org marketplace in navigation", func() {
			marketplace = nav.ClickOrgMarketplace(testEnvVars.TestOrgName)
		})

		By("allowing the manager to see a lists of services", func() {
			service = marketplace.FindService("rds")
		})

		By("allowing the manager to see a list of service plans for a service", func() {
			var costHeading = service.PlanList.FindByXPath("thead/tr/th[.='Cost']")
			Eventually(costHeading).Should(BeFound())
			var firstPlan = service.PlanList.First("tbody tr")
			Eventually(firstPlan).Should(BeFound())
			var nameField = firstPlan.First("td")
			Eventually(nameField).Should(BeFound())
		})
	})

	XIt("should allow an org manager to create a service instance", func() {
		var service Service

		By("allowing the user to click on the org marketplace in navigation", func() {
			marketplace = nav.ClickOrgMarketplace(testEnvVars.TestOrgName)
		})

		By("allowing the manager to see a lists of services", func() {
			service = marketplace.FindService("rds")
		})

		By("allowing the user to create a service of type 'rds'", func() {
			service.CreateService("shared-psql", testInstanceName,
				testEnvVars.TestSpaceName)
		})

		By("verifying the service was created", func() {

		})
	})

	XIt("should allow a user to delete a service instance", func() {
		var spaces Spaces

		By("allowing the manager to navigate to the org spaces in the navigation", func() {
			nav = SetupNav(page)
			spaces = nav.ClickOrgSpaces(testEnvVars.TestOrgName)
		})

		By("allowing the user to click the on test space", func() {
			space = spaces.ViewSpace(testEnvVars.TestSpaceName)
		})

		By("allowing the user to click the on test service instances tab", func() {
			services = space.ViewServiceInstances()
		})

		By("finding the unbound service instance and delete it", func() {
			services.DeleteServiceInstance(testInstanceName)
		})

		By("verifying that the service is gone", func() {
			Skip("works locally but not on Travis. we can assume everything worked out if we made it this far.")
			services.VerifyServiceInstanceDoesNotExist("testService01")
		})
	})

	XIt("should allow a user to create a service instance and bind it to an app.", func() {
		By("allowing the user to click on an organization in navigation", func() {
			nav = SetupNav(page)
			nav.ClickOrg(testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org marketplace in navigation", func() {
			marketplace = nav.ClickOrgMarketplace("")
		})

		By("allowing the user to create a service of type 'rds'", func() {
			marketplace.CreateService("rds", "shared-psql", "testService01", testEnvVars.TestSpaceName)
		})

		By("allowing the user to click on the org spaces in the org dropdown menu", func() {
			nav.ClickSpaces()
		})

		By("allowing the user to click the on test space", func() {
			space = spaces.ViewSpace(testEnvVars.TestSpaceName)
		})

		By("going to the app page", func() {
			app = space.ViewApp(testEnvVars.TestAppName)
		})

		By("binding the service to the app", func() {
			app.BindToService("testService01")
		})

		By("unbinding the service from the app", func() {
			app.UnbindFromService("testService01")
		})
		By("rebinding the service to the app", func() {
			app.BindToService("testService01")
		})
	})

	XIt("should allow a user to delete a bound service instance", func() {
		By("allowing the user to click on an organization in navigation", func() {
			nav = SetupNav(page)
			nav.ClickOrg(testEnvVars.TestOrgName)
		})

		By("allowing the user to click on the org spaces in the navigation", func() {
			spaces = nav.ClickSpaces()
		})

		By("allowing the user to click the on test space", func() {
			space = spaces.ViewSpace(testEnvVars.TestSpaceName)
		})

		By("allowing the user to click the on test service instances tab", func() {
			services = space.ViewServiceInstances()
		})
		By("finding the unbound service instance and delete it", func() {
			services.DeleteBoundServiceInstance("testService01")
		})
		By("verifying that the service is gone", func() {
			Skip("works locally but not on Travis. we can assume everything worked out if we made it this far.")
			services.VerifyServiceInstanceDoesNotExist("testService01")
		})
	})

	AfterEach(func() {
		// Logout user
		user.LogoutOf(page)
		// Destroy the page
		Expect(page.Destroy()).To(Succeed())
		// Close the server.
		server.Close()
	})
})
