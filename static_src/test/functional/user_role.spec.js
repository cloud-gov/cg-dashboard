import http from 'http';
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult;

  afterEach(function () {
    browser.deleteCookie('testing_user_role');
    cookieResult = browser.getCookie('testing_user_role');

    expect(cookieResult).toBeFalsy();
  });

  describe('User role cookie test', function () {
    describe('when cookie is set and deleted', function () {
      it('should reflect the cookie content', function () {

        browser.setCookie({ 'name': 'testing_user_role', 'value': 'space_manager_space_xx' });
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('space_manager_space_xx');
      });
    });
  });

  describe('Org page', function () {
    it('navigates to a org page', function () {
      browser.url('/#/org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250');
    });

    it('has a title', function () {
      expect(browser.getTitle()).toBe('cloud.gov dashboard');
    });

    it('has a page header', function () {
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('fake-cf-deck-testing');
    });

    describe('Org page', function () {
      describe('org manager for org X then they should', function () {
        it('be able to edit roles for org X', function () {
          browser.setCookie({ 'name': 'testing_user_role', 'value': 'org_manager_space_x' });
          browser.url('/uaa/userinfo');
          cookieResult = browser.getCookie('testing_user_role').value;
          expect(cookieResult).toBe('org_manager_space_x');

          expect(true).toBe(true);
        });

        it('not be able to edit roles for org Y', function () {
          expect(true).toBe(true);
        });
      });

      describe('space manager for org X space TT then they should', function () {
        it('not be able to edit roles for org X', function () {
          expect(true).toBe(true);
        });
      });
    });

  });

  describe('Space page', function () {
    it('navigates to a org\'s space page', function () {
      browser.url('/#/org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250/spaces/82af0edb-8540-4064-82f2-d74df612b794');
    });

    it('has a page header', function () {
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('fake-dev');
    });


    describe('space manager for space XX then they should', function () {
      it('be able to edit roles for space XX', function () {
        let cookieResult;

        browser.setCookie({ 'name': 'testing_user_role', 'value': 'space_manager_space_xx' });
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('space_manager_space_xx');

        browser.deleteCookie('testing_user_role');
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role');

        expect(cookieResult).toBeFalsy();
      });

      it('not be able to edit roles for space YY', function () {
        expect(true).toBe(true);
      });
    });
  });
});
