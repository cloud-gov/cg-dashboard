
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult,
    userRoleElement;
  const guid_manager_orgX = 'org-manager-x-uid-601d-48c4-9705',
    guid_manager_orgY = 'org-manager-y-uid-601d-48c4-9705',
    cookie_manager_orgY = 'org_manager_org_y',
    cookie_manager_orgX = 'org_manager_org_x',
    cookie_manager_spaceXX = 'space_manager_space_xx',
    cookie_manager_spaceYY = 'space_manager_space_yy',
    url_orgY = '/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250',
    url_orgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('User role cookie test', function () {
    afterEach(function () {
      browser.deleteCookie('testing_user_role');
    });

    describe('when cookie is set and deleted', function () {
      it('should reflect the cookie content', function () {
        browser.url('/');
        browser.setCookie({ name: 'testing_user_role', value: cookie_manager_spaceXX });
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe(cookie_manager_spaceXX);
      });
    });
  });

  describe('Org page as org manager X', function () {
    describe('if org manager Y then they', function () {
      it('should navigates to org Y ', function () {
        browser.url(url_orgY);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement( browser, browser.element('.test-users') );

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should not be able to edit roles for org Y', function () {
        expect(userRoleElement.isUserOrgManager(guid_manager_orgX)).toBe(false);
        expect(userRoleElement.isUserOrgManager(guid_manager_orgY)).toBe(true);
      });
    });

    describe('if manager for org X then they', function () {
      it('should navigates to org X ', function () {
        browser.url(url_orgX);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement( browser, browser.element('.test-users') );

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should be able to edit roles for org X', function () {
        expect(userRoleElement.isUserOrgManager(guid_manager_orgX)).toBe(true);
        expect(userRoleElement.isUserOrgManager(guid_manager_orgY)).toBe(false);
      });
    });
  });

  describe('Testing user roles', function () {
    it('Setup userRoleElement', function () {
      browser.url(url_orgX);
      browser.waitForExist('.test-users');
      userRoleElement = new UserRoleElement( browser, browser.element('.test-users') );
    });

    afterEach(function () {
      browser.deleteCookie('testing_user_role');
    });

    describe('On page for org x', function () {
      it('as org manager y should not have permission to edit fields', function () {
        userRoleElement.setUserRole(browser, url_orgX, cookie_manager_orgY);
        cookieResult = userRoleElement.getUserRole(browser, url_orgX);
        expect(cookieResult).toBe(cookie_manager_orgY);
        expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(false);
      });

      it('as org manager x should have permission to edit fields', function () {
        userRoleElement.setUserRole(browser, url_orgX, cookie_manager_orgX);
        cookieResult = userRoleElement.getUserRole(browser, url_orgY);
        expect(cookieResult).toBe(cookie_manager_orgX);
        expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(true);
      });
    });

    describe('On page for org y', function () {
      it('as org manager x should not have permission to edit fields', function () {
        userRoleElement.setUserRole(browser, url_orgY, cookie_manager_orgX);
        cookieResult = userRoleElement.getUserRole(browser, url_orgY);
        expect(cookieResult).toBe(cookie_manager_orgX);
        expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(false);
      });

      it('as org manager y should have permission to edit fields', function () {
        userRoleElement.setUserRole(browser, url_orgY, cookie_manager_orgY);
        cookieResult = userRoleElement.getUserRole(browser, url_orgY);
        expect(cookieResult).toBe(cookie_manager_orgY);
        expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(true);
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
      });
    });
  });
});
