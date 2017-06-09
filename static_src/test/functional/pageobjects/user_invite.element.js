
import BaseElement from './base.element';

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a UserInviteElement for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property

export default class UserInviteElement extends BaseElement {
  inputToInviteForm(input) {
    browser.waitForExist('.test-users_invite_name');
    return this.element('.test-users_invite_name').setValue(input);
  }

  getInviteFormValue() {
    browser.waitForExist('.test-users_invite_name');
    return this.element('.test-users_invite_name').getValue();
  }

  submitInviteForm() {
    browser.waitForExist('[type="submit"]');
    const existingUserCount = this.countNumberOfUsers();
    this.element('[type="submit"]').click();
    browser.waitUntil(() =>
      this.countNumberOfUsers() > existingUserCount ||
      browser.isExisting('.test-users-invite .error_message')
    , 10000);
  }

  // TODO move this to user list element.
  countNumberOfUsers() {
    browser.waitForExist('.test-users .complex_list-item');
    return browser.elements('.test-users .complex_list-item').value.length;
  }

  // TODO move this to user list element.
  getUserByIndex(idx) {
    const sel = `.test-users .complex_list-item:nth-child(${idx})`;
    browser.waitForExist(sel);
    return browser.elements(sel).value[0];
  }

  getErrorMessage() {
    const errorEl = this.element('.error_message');
    if (errorEl) {
      return errorEl.getText();
    }
    return null;
  }
}
