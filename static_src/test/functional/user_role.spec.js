
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult,
    userRoleElement,
    pageUrl,
    cookieValue;
  const guidManagerOrgX = 'org-manager-x-uid-601d-48c4-9705',
    guidManagerOrgY = 'org-manager-y-uid-601d-48c4-9705',
    cookieManagerOrgY = 'org_manager_org_y',
    cookieManagerOrgX = 'org_manager_org_x',
    cookieManagerSpaceXX = 'space_manager_space_xx',
    // cookieManagerSpaceYY = 'space_manager_space_yy',
    urlOrgY = '/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250',
    urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('User role cookie test', function () {
    afterEach(function () {
      browser.deleteCookie('testing_user_role');
    });

    describe('when cookie is set and deleted', function () {
      it('should reflect the cookie content', function () {
        browser.url('/');
        browser.setCookie({ name: 'testing_user_role', value: cookieManagerSpaceXX });
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe(cookieManagerSpaceXX);
      });
    });
  });

  describe('Org page as org manager X', function () {
    describe('if org manager Y then they', function () {
      it('should navigates to org Y ', function () {
        browser.url(urlOrgY);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should not be able to edit roles for org Y', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgX)).toBe(false);
        expect(userRoleElement.isUserOrgManager(guidManagerOrgY)).toBe(true);
      });
    });

    describe('if manager for org X then they', function () {
      it('should navigates to org X ', function () {
        browser.url(urlOrgX);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should be able to edit roles for org X', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgX)).toBe(true);
        expect(userRoleElement.isUserOrgManager(guidManagerOrgY)).toBe(false);
      });
    });
  });

  describe('Testing user roles', function () {
    it('Setup userRoleElement', function () {
      browser.url(urlOrgX);
      browser.waitForExist('.test-users');
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
    });

    describe('As org manager Y', function () {
      it('set cookie to org Y manager', function () {
        cookieValue = cookieManagerOrgY;
      });

      describe('shouldn\'t have permission to edit fields on org X pages', function () {
        it('set url', function () {
          pageUrl = urlOrgX;
        });

        it('verify cookie', function () {
          cookieResult = userRoleElement.setAndGetUserRole(browser, pageUrl, cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgY);
        });

        it('verify org Y manager can modify org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(false);
        });
      });

      describe('should have permission to edit fields on org Y pages', function () {
        it('set url', function () {
          pageUrl = urlOrgY;
        });

        it('verify cookie', function () {
          cookieResult = userRoleElement.setAndGetUserRole(browser, pageUrl, cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgY);
        });

        it('verify org Y manager can modify org Y page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(true);
        });
      });
    });

    describe('As org manager X', function () {
      it('set cookie to org X manager', function () {
        cookieValue = cookieManagerOrgX;
      });

      describe('shouldn\'t have permission to edit fields on org Y pages', function () {
        it('set url', function () {
          pageUrl = urlOrgY;
        });

        it('verify cookie', function () {
          cookieResult = userRoleElement.setAndGetUserRole(browser, pageUrl, cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgX);
        });

        it('verify org X manager can modify org Y page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(false);
        });
      });

      describe('should have permission to edit fields on org X pages', function () {
        it('set url', function () {
          pageUrl = urlOrgX;
        });

        it('verify cookie', function () {
          cookieResult = userRoleElement.setAndGetUserRole(browser, pageUrl, cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgX);
        });

        it('verify org X manager can modify org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled(browser)).toBe(true);
        });
      });
    });

    it('delete cookie after', function () {
      browser.deleteCookie('testing_user_role');
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
