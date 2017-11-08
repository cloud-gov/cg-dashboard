import BaseElement from "./base.element";

const breadcrumbs = '[data-test="breadcrumbs"]';

const selectors = {
  primary: breadcrumbs,
  overview: `${breadcrumbs} [data-test="overview"]`,
  org: `${breadcrumbs} [data-test="org"]`,
  space: `${breadcrumbs} [data-test="space"]`
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
