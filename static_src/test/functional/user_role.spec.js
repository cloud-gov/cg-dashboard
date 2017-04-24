
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult,
      orgXmanagerXGuid = "org-manager-x-uid-581d-48c4-9705",
      orgXmanagerYGuid = "org-manager-y-uid-581d-48c4-9705";

  beforeEach(function () {
    browser.url('/');
  });

  afterEach(function () {
    browser.deleteCookie('testing_user_role');
  });

  userRoleElement = new UserRoleElement(
    browser,
    browser.element('.test-users')
  );

  describe('User role cookie test', function () {
    describe('when cookie is set and deleted', function () {
      it('should reflect the cookie content', function () {
        browser.setCookie({ name: 'testing_user_role', value: 'space_manager_space_xx' });
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('space_manager_space_xx');
      });
    });
  });

  describe('Org page', function () {
    beforeEach(function () {
      browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
    });

    it('has a title', function () {
      expect(browser.getTitle()).toBe('cloud.gov dashboard');
    });

    it('has a page header', function () {
      browser.waitForExist('.test-page-header-title', 2000);
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('fake-cf-user_role-org_x-testing');
    });

    describe('org manager for org X then they should', function () {
      beforeEach(function () {
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_x' });

        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_x');
      });

      it('not be able to edit roles for org Y', function () {
        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');

        expect(userRoleElement.isUserOrgManager(orgXmanagerXGuid)).toBe(false);
        expect(userRoleElement.isUserOrgManager(orgXmanagerYGuid)).toBe(true);
      });

      it('be able to edit roles for org X', function () {
        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');

        expect(userRoleElement.isUserOrgManager(orgXmanagerXGuid)).toBe(true);
        expect(userRoleElement.isUserOrgManager(orgXmanagerYGuid)).toBe(false);
      });
    });

    describe('space manager for org X space TT then they should', function () {
      it('not be able to edit roles for org X', function () {
        expect(true).toBe(true);
      });
    });
  });

  describe('Space page', function () {
    beforeEach(function () {
      const orgGuid = 'user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';
      const spaceGuid = 'user_role-org_x-space_xx-4064-82f2-d74df612b794';

      browser.url(`/#/org/${orgGuid}/spaces/${spaceGuid}`);
    });

    it('navigates to a org\'s space page', function () {
      browser.waitForExist('.test-page-header-title', 2000);
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('user_role-org_x-space_xx');
    });

    describe('space manager for space XX then they should', function () {
      it('be able to edit roles for space XX', function () {
        browser.setCookie({ name: 'testing_user_role', value: 'space_manager_space_xx' });
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
