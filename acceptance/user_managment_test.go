// +build acceptance

package acceptance

import (
	"fmt"
	. "github.com/18F/cg-deck/acceptance/util"
	. "github.com/18F/cg-deck/acceptance/views"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"net/http/httptest"
)

var _ = Describe("UserManagement", func() {
	var (
		page        *agouti.Page
		server      *httptest.Server
		testEnvVars AcceptanceTestEnvVars
		spaces      Spaces
		user        User
		nav         Nav
		testOrg     string
		testSpace   string
	)

	testEnvVars = AcceptanceTestEnvVars{}
	testEnvVars.LoadTestEnvVars()
	testOrg = "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250"
	testSpace = "b7e56bba-b01b-4c14-883f-2e6d15284b58"

	BeforeEach(func() {
		// Start a test server
		server, testEnvVars = startServer()

		// Create a fresh page to navigate.
		page = createPage()

		// Reset page
		resetPage(page, testEnvVars)

		// Create user
		user = StartUserSessionWith(testEnvVars)

		// Log user in
		user.LoginTo(page)

		// Get a nav resource
		nav = SetupNav(page)
	})

	It("should allow a space manager to see a list of users for a space", func() {
		By("allowing manager to click on spaces in an org the navigation", func() {
			spaces = nav.ClickOrgSpaces(testEnvVars.TestOrgName)
		})

		By("allowing manager to click on a certain space", func() {
			Eventually(spaces.ViewSpace(testEnvVars.TestSpaceName))
			Eventually(page).Should(HaveURL(fmt.Sprintf(
				"%s/#/org/%s/spaces/%s", testEnvVars.Hostname, testOrg, testSpace)))
		})

		By("allowing manager to click on user management tab", func() {
			spaces.ClickUserManagement()
			Eventually(page).Should(HaveURL(fmt.Sprintf(
				"%s/#/org/%s/spaces/%s/users", testEnvVars.Hostname, testOrg, testSpace)))
		})

		By("having the active tab set to default space users", func() {
			Eventually(page.First(".test-subnav-users")).Should(BeVisible())
			Expect(page.First(".test-subnav-users .active").Text()).To(Equal("Current space users"))
		})

		By("seeing a user list for spaces on the first page by default", func() {
			Eventually(page.First(".table")).Should(BeFound())
			Eventually(page.First(".table tbody tr")).Should(BeFound())
		})
	})

	It("should allow a org manager to see a list of users for an org", func() {
		By("allowing the user to navigate to the space users page", func() {
			Expect(page.Navigate(fmt.Sprintf(testEnvVars.Hostname+
				"/#/org/%s/spaces/%s/users",
				testOrg, testSpace))).To(Succeed())
		})

		By("allowing the user to navigate to the all org users page", func() {
			var orgUsersLink = page.FindByLink("All organization users")
			Eventually(orgUsersLink).Should(BeFound())
			Expect(orgUsersLink.Click()).To(Succeed())
		})

		By("seeing a user list for the whole org", func() {
			var table = page.First(".table")
			Eventually(table).Should(BeFound())
			var rows = table.First("tbody tr")
			Eventually(rows).Should(BeFound())
			Expect(rows.Count()).Should(BeNumerically(">=", 1))
		})
	})

	It("should allow an org manager to change a space users pemissions", func() {
		var userRow *agouti.Selection

		By("allowing the user to navigate to the space users page", func() {
			Expect(page.Navigate(fmt.Sprintf("%s/#/org/%s/spaces/%s/users", 
			testEnvVars.Hostname, testOrg, testSpace))).To(Succeed())
		})

		By("seeing a user list for the whole org", func() {
			var table = page.First(".table")
			Eventually(table).Should(BeFound())
			var row = table.First("tbody tr")
			Eventually(row).Should(BeFound())
			userRow = row
			Expect(row.Count()).Should(BeNumerically(">=", 1))
		})

		By("Setting the permissions for a user", func() {
			var userPerms = userRow.FindByXPath("following-sibling::*[1]")
			var checked = userPerms.All("input:checked[type='checkbox']")
			Eventually(checked).Should(BeFound())
			var checkedStartNum, _ = checked.Count()

			var _ = user.DeactivatePermission(userRow, "Billing Manager")
			checked = userPerms.All("input:checked[type='checkbox']")
			var _ = user.ActivatePermission(userRow, "Billing Manager")
			checked = userPerms.All("input:checked[type='checkbox']")
			Eventually(checked).Should(HaveCount(checkedStartNum))
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
