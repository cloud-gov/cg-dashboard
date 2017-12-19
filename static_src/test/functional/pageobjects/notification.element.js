import BaseElement from "./base.element";

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a DOM element for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property
const selectors = {
  notificationMessage: ".test-notification-message",
  notificationAction: ".test-notification-action",
  notificationDismiss: ".test-notification-dismiss"
};

export default class NotificationElement extends BaseElement {
  message() {
    return this.element(selectors.notificationMessage).getText();
  }

  dismissAction() {
    return this.element(selectors.notificationDismiss);
  }

  refreshAction() {
    return this.element(selectors.notificationAction);
  }

  notificationStatus() {}

  exists() {
    return !!this.isVisible();
  }

  dismiss() {
    this.dismissAction().click();
  }
}
