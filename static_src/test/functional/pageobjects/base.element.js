// https://www.martinfowler.com/bliki/PageObject.html

/**
 * BaseFederalistElement
 *
 * An API to handle WebElement JSON objects by leveraging the [webdriverio
 * protocol methods](http://webdriver.io/api.html). This implements
 * (incomplete) some of the helper methods from webdriverio to make it easier
 * to deal with a single component.
 **/

import assert from "assert";

export default class BaseElement {
  constructor(browser, webElementOrSelector) {
    this.browser = browser;

    let webElement = webElementOrSelector;
    if (typeof webElementOrSelector === "string") {
      browser.waitForExist(webElementOrSelector);
      webElement = browser.element(webElementOrSelector);
    }

    assert(
      webElement.value,
      `Element '${webElement.selector}' does not exist in the DOM.`
    );
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
