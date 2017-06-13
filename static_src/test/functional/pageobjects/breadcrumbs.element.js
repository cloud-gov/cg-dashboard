
import BaseElement from './base.element';

// https://www.martinfowler.com/bliki/PageObject.html
//
// Represents a DOM element for making assertions against. This makes it
// easier to abstract some of the webdriver details from the UI component.

// TODO attach to class as static property
const breadcrumbs = '.test-breadcrumbs';

const selectors = {
  primary: breadcrumbs,
  overview: `${breadcrumbs} li:first-child a`,
  org: `${breadcrumbs} li:nth-child(1) a`,
  space: `${breadcrumbs} li:last-child a`
};

export default class Breadcrumbs extends BaseElement {
  overviewLink() {
    return this.element(selectors.overview);
  }

  orgLink() {
    return this.element(selectors.org);
  }

  spaceLink() {
    return this.element(selectors.space);
  }

  goToSpace() {
    const spaceLink = this.spaceLink();
    spaceLink.click();
  }

  exists() {
    return !!this.isVisible();
  }
}

Breadcrumbs.primarySelector = selectors.primary;

