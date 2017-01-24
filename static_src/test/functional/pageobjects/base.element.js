
// https://www.martinfowler.com/bliki/PageObject.html

/**
 * BaseFederalistElement
 *
 * An API to handle WebElement JSON objects by leveraging the [webdriverio
 * protocol methods](http://webdriver.io/api.html). This implements
 * (incomplete) some of the helper methods from webdriverio to make it easier
 * to deal with a single component.
 **/

export default class BaseElement {
  constructor(browser, webElement) {
    this.browser = browser;
    this.webElementId = webElement.value.ELEMENT;
  }

  webElement() {
    return this.browser.elementIdElement(this.webElementId);
  }

  element(selector) {
    return this.browser.elementIdElement(this.webElementId, selector);
  }

  elements(selector) {
    return this.browser.elementIdElements(this.webElementId, selector).value;
  }

  isVisible() {
    return this.browser.elementIdDisplayed(this.webElementId).value;
  }

  click() {
    return this.browser.elementIdClick(this.webElementId);
  }
}
