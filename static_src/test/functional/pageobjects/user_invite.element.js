import BaseElement from "./base.element";

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a UserInviteElement for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

const userInvite = ".test-users-invite";

const selectors = {
  primary: userInvite,
  name: ".test-users_invite_name",
  submit: '[type="submit"]',
  error: ".error_message",
  validator: ".error span.error_message"
};

export default class UserInviteElement extends BaseElement {
  inputToInviteForm(input) {
    browser.waitForExist(`${selectors.primary} ${selectors.name}`);
    return this.element(selectors.name).setValue(input);
  }

  getInviteFormValue() {
    browser.waitForExist(`${selectors.primary} ${selectors.name}`);
    return this.element(selectors.name).getValue();
  }

  submitInviteForm() {
    browser.waitForExist(`${selectors.primary} ${selectors.submit}`);
    const existingUserCount = this.countNumberOfUsers();
    this.element(selectors.submit).click();
    browser.waitUntil(
      () =>
        this.countNumberOfUsers() > existingUserCount ||
        browser.isExisting(`${selectors.primary} ${selectors.error}`),
      10000
    );
  }

  // TODO move this to user list element.
  countNumberOfUsers() {
    browser.waitForExist(".test-users .complex_list-item");
    return browser.elements(".test-users .complex_list-item").value.length;
  }

  // TODO move this to user list element.
  countNumberOfUserSelectors() {
    browser.waitForExist("select.test-users-selector-field");
    return browser.elements("select.test-users-selector-field").value.length;
  }

  // TODO move this to user list element.
  getUserByIndex(idx) {
    const sel = `.test-users .complex_list-item:nth-child(${idx})`;
    browser.waitForExist(sel);
    return browser.elements(sel).value[0];
  }

  getErrorMessage() {
    const errorEl = this.element(selectors.error);
    if (errorEl) {
      return errorEl.getText();
    }
    return null;
  }

  getValidatorMessage() {
    const errorEl = this.element(selectors.validator);
    if (errorEl) {
      return errorEl.getText();
    }
    return null;
  }
}

UserInviteElement.primarySelector = userInvite;
