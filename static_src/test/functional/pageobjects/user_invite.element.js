
import BaseElement from './base.element';

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a UserInviteElement for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property

export default class UserInviteElement extends BaseElement {
  inputToInviteForm(input) {
    return this.element('.test-users_invite_name').setValue(input);
  }

  getInviteFormValue() {
    return this.element('.test-users_invite_name').getValue();
  }

  submitInviteForm() {
    const existingUserCount = this.countNumberOfUsers();
    this.element('[type="submit"]').click();
    browser.waitUntil(() =>
      this.countNumberOfUsers() > existingUserCount ||
      browser.isExisting('.test-users-invite .error_message')
    , 10000);
  }

  // TODO move this to user list element.
  countNumberOfUsers() {
    return browser.elements('.test-users .complex_list-item').value.length;
  }

  // TODO move this to user list element.
  getUserByIndex(idx) {
    return browser.elements(`.test-users .complex_list-item:nth-child(${idx})`)
      .value[0];
  }

  getErrorMessage() {
    const errorEl = this.element('.error_message');
    if (errorEl) {
      return errorEl.getText();
    }
    return null;
  }
}
