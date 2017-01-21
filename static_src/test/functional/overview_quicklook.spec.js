
import './global_setup';

describe('Overview page', function () {
  it('navigates to page', function () {
    browser.url('/');
    expect(browser.getTitle()).toBe('cloud.gov dashboard');
  });
});
