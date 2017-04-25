
import BaseElement from './base.element';

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
    this.browser.setCookie({ name: 'testing_user_role', value: cookieValue });
    this.browser.refresh();
  }

  getUserRole() {
    return this.browser.getCookie('testing_user_role').value;
  }

  isFirstUserRoleEnabled() {
    return this.browser.isEnabled('.test-user-role-control input')[0];
  }

  isUserOrgManager(guid) {
    return !!this.browser.getAttribute(`#org_manager${guid}`, 'checked');
  }

  isUserBillingManager(guid) {
    return !!this.browser.getAttribute(`#billing_manager${guid}`, 'checked');
  }

  isUserOrgAuditor(guid) {
    return !!this.browser.getAttribute(`#org_auditor${guid}`, 'checked');
  }
}
