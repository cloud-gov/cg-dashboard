
import BaseElement from './base.element';

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a UserRoleElement for making assertions against. This makes it
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
    return this.element('.users_invite_form').submit();
  }

  countNumberOfUsers() {
    return this.elements('.complex_list-item').length;
  }
}
