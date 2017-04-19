
import UserRoleElement from './pageobjects/user_role.element';

describe('Overview page', function () {
  it('navigates to page', function () {
    browser.url('/#/org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250');
  });

  it('has a title', function () {
    expect(browser.getTitle()).toBe('cloud.gov dashboard');
  });

  it('has a page header', function () {
    const pageHeader = browser.element('.test-page-header-title');
    expect(pageHeader.getText()).toBe('fake-cf-deck-testing');
  });

});
