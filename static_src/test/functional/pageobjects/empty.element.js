
import BaseElement from './base.element';

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a OrgQuicklookElement for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

const primary = '.test-empty';

const selectors = {
  primary,
  callout: '.test-empty-callout',
  content: '.test-empty-callout + *'
};

export default class EmptyElement extends BaseElement {
  callout() {
    return this.element(selectors.callout).getText();
  }

  content() {
    return this.elements(selectors.callout);
  }
}

EmptyElement.primarySelector = selectors.primary;
