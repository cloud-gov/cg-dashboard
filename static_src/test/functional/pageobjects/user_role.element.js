import BaseElement from "./base.element";

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a UserRoleElement for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property

export default class UserRoleElement extends BaseElement {
  // TODO: Look into why "this.element('#org_role' + guid).checked
  // does not work. Currently, it doesn't work that way.
  setAndGetUserRole(cookieValue) {
    this.setUserRole(cookieValue);
    return this.getUserRole();
  }

  setUserRole(cookieValue) {
    this.browser.setCookie({ name: "testing_user_role", value: cookieValue });
    this.browser.refresh();
  }

  getUserRole() {
    return this.browser.getCookie("testing_user_role").value;
  }

  isFirstUserRoleEnabled() {
    return this.browser.isEnabled(".test-user-role-control input")[0];
  }

  isUserOrgManager(guid) {
    return !!this.browser.getAttribute(`#org_manager${guid}`, "checked");
  }

  isUserBillingManager(guid) {
    return !!this.browser.getAttribute(`#billing_manager${guid}`, "checked");
  }

  isUserOrgAuditor(guid) {
    return !!this.browser.getAttribute(`#org_auditor${guid}`, "checked");
  }

  isUserSpaceManager(guid) {
    return !!this.browser.getAttribute(`#space_manager${guid}`, "checked");
  }

  isUserSpaceDeveloper(guid) {
    return !!this.browser.getAttribute(`#space_developer${guid}`, "checked");
  }

  isUserSpaceAuditor(guid) {
    return !!this.browser.getAttribute(`#space_auditor${guid}`, "checked");
  }

  toggleAccess(selector, state) {
    this.browser.click(selector);
    // waitForSelected's state parameter operates in reverse.
    // if passed true, it will wait for it to be unchecked.
    // if passed false, it will operate as normal and wait for it to be checked.
    // http://webdriver.io/api/utility/waitForSelected.html
    // just flip the state to what the user expected to get the behavior of
    // which state waitForSelected looks for.
    // returns true in success of finding whichever desired state.
    // will never return false. instead, will throw an error.
    // Sample of how it works:
    // https://github.com/webdriverio/webdriverio/blob/v4.6.1/test/spec/waitFor.js#L58-L66
    return this.browser.waitForSelected(selector, 2000, !state);
  }

  toggleOrgManagerAccess(guid, state) {
    return this.toggleAccess(`#org_manager${guid}`, state);
  }

  toggleBillingManagerAccess(guid, state) {
    return this.toggleAccess(`#billing_manager${guid}`, state);
  }

  toggleOrgAuditorAccess(guid, state) {
    return this.toggleAccess(`#org_auditor${guid}`, state);
  }

  toggleSpaceManagerAccess(guid, state) {
    return this.toggleAccess(`#space_manager${guid}`, state);
  }

  toggleSpaceDeveloperAccess(guid, state) {
    return this.toggleAccess(`#space_developer${guid}`, state);
  }

  toggleSpaceAuditorAccess(guid, state) {
    return this.toggleAccess(`#space_auditor${guid}`, state);
  }
}
