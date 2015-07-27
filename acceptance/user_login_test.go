// +build acceptance

package acceptance

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"
	"github.com/gocraft/web"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	. "github.com/sclevine/agouti/matchers"

	"fmt"
	"net/http/httptest"
	"os"
	"time"
)

type AcceptanceTestEnvVars struct {
	helpers.EnvVars
	Username string
	Password string
}

func (ev *AcceptanceTestEnvVars) loadTestEnvVars() {
	ev.Username = os.Getenv("CONSOLE_TEST_USERNAME")
	ev.Password = os.Getenv("CONSOLE_TEST_PASSWORD")

	if len(ev.Username) < 1 {
		fmt.Println("Please set CONSOLE_TEST_USERNAME")
		os.Exit(1)
	}

	if len(ev.Password) < 1 {
		fmt.Println("Please set CONSOLE_TEST_PASSWORD")
		os.Exit(1)
	}
	// The app will catch the rest of these
	ev.ClientID = os.Getenv(helpers.ClientIDEnvVar)
	ev.ClientSecret = os.Getenv(helpers.ClientSecretEnvVar)
	ev.Hostname = os.Getenv(helpers.HostnameEnvVar)
	ev.LoginURL = os.Getenv(helpers.LoginURLEnvVar)
	ev.UAAURL = os.Getenv(helpers.UAAURLEnvVar)
	ev.APIURL = os.Getenv(helpers.APIURLEnvVar)

}

var _ = Describe("UserLogin", func() {
	var (
		page   *agouti.Page
		server *httptest.Server
	)

	testEnvVars := AcceptanceTestEnvVars{}
	testEnvVars.loadTestEnvVars()

	BeforeEach(func() {
		var err error
		app, settings, err := controllers.InitApp(testEnvVars.EnvVars)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
		app.Middleware(web.StaticMiddleware("../static", web.StaticOption{IndexFile: "index.html"}))
		page, err = agoutiDriver.NewPage()
		//page, err = agoutiDriver.NewPage(agouti.Browser("chrome"))

		Expect(err).NotTo(HaveOccurred())
		page.ClearCookies()
		server = httptest.NewUnstartedServer(app)
		server.Start()
		testEnvVars.Hostname = server.URL
		settings.OAuthConfig.RedirectURL = server.URL + "/oauth2callback"
	})
	It("should manage user authentication", func() {
		By("redirecting the user to the login form from the home page", func() {
			Expect(page.Navigate(testEnvVars.Hostname)).To(Succeed())
		})

		By("allowing the user to fill out the login form and submit it", func() {
			// Eventually(page.FindyByLabel("E-mail")).Should(BeFound())
			// Expect(page.FindByLabel("E-mail").Fill("spud@example.com")).To(Succeed())
			// Expect(page.FindByLabel("Password").Fill("secret-password")).To(Succeed())
			Eventually(Expect(page.Find("#login-btn").Click()).To(Succeed()))
			time.Sleep(100 * time.Millisecond)
			Eventually(Expect(page).To(HaveURL(testEnvVars.LoginURL + "/login")))
			Expect(page.FindByName("username").Fill(testEnvVars.Username)).To(Succeed())
			Expect(page.FindByName("password").Fill(testEnvVars.Password)).To(Succeed())
			Expect(page.FindByButton("Sign in").Click()).To(Succeed())
			time.Sleep(100 * time.Millisecond)
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/dashboard"))
		})

		/*
			By("allowing the user to view their profile", func() {
				Eventually(page.FindByLink("Profile Page")).Should(BeFound())
				Expect(page.FindByLink("Profile Page").Click()).To(Succeed())
				profile := page.Find("section.profile")
				Eventually(profile.Find(".greeting")).Should(HaveText("Hello Spud!"))
				Expect(profile.Find("img#profile_pic")).To(BeVisible())
			})

			By("allowing the user to log out", func() {
				Expect(page.Find("#logout").Click()).To(Succeed())
				Expect(page).To(HavePopupText("Are you sure?"))
				Expect(page.ConfirmPopup()).To(Succeed())
				Eventually(page).Should(HaveTitle("Login"))
			})
		*/
	})

	It("should redirect users to login page if accessing privileged dashboard page without first logining in.", func() {
		By("redirecting the user to the login form", func() {
			Expect(page.Navigate(testEnvVars.Hostname + "/#/dashboard")).To(Succeed())
			Expect(page).To(HaveURL(testEnvVars.Hostname + "/#/"))
		})

	})
	AfterEach(func() {
		Expect(page.Destroy()).To(Succeed())
		server.Close()
	})
})
