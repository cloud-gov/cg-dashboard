
import './global_setup';

describe('Overview page', function () {
  it('navigates to page', function () {
    browser.url('http://localhost:8000/');
    expect(browser.getTitle()).toBe('cloud.gov dashboard');
  });
});
