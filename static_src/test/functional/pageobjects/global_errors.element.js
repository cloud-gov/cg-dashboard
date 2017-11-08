import BaseElement from "./base.element";
import NotificationElement from "./notification.element";

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a DOM element for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property
const selectors = {
  notifications: ".test-notification",
  firstNotification: ".test-notification:first-child"
};

export default class GlobalErrorsElement extends BaseElement {
  notifications() {
    return this.elements(selectors.notifications);
  }

  firstNotification() {
    return new NotificationElement(
      this.browser,
      this.element(selectors.firstNotification)
    );
  }

  exists() {
    return !!this.isVisible();
  }
}
