
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult,
    userRoleElement,
    cookieValue;
  const guidManagerOrgX = 'org-manager-x-uid-601d-48c4-9705',
    guidManagerOrgY = 'org-manager-y-uid-601d-48c4-9705',
    guidManagerOrgXSpaceXX = 'org-x-space-manager-xx-uid-601d-48c4-9705',
    guidManagerOrgXSpaceYY = 'org-x-space-manager-yy-uid-601d-48c4-9705',
    cookieManagerOrgY = 'org_manager_org_y',
    cookieManagerOrgX = 'org_manager_org_x',
    cookieManagerOrgXSpaceXX = 'org_x_space_manager_space_xx',
    cookieManagerOrgXSpaceYY = 'org_x_space_manager_space_yy',
    urlOrgY = '/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250',
    urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250',
    urlOrgXSpaceXX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250/spaces/' +
      'user_role-org_x-space_xx-4064-82f2-d74df612b794',
    urlOrgXSpaceYY = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250/spaces/' +
      'user_role-org_x-space_yy-4064-82f2-d74df612b794';

  describe('A user on page for an org', function () {
    describe('on page for org X should see only manager X has user permissions', function () {
      it('should navigates to org X', function () {
        browser.url(urlOrgX);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should see manager X has Org Manager access', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgX)).toBe(true);
      });

      it('should see manager Y does not have Org Manager access', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgY)).toBe(false);
      });
    });

    describe('on page for org Y should see only manager Y has user permissions', function () {
      it('should navigates to org Y', function () {
        browser.url(urlOrgY);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should see manager Y has Org Manager access', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgY)).toBe(true);
      });

      it('should see manager X does not have Org Manager access', function () {
        expect(userRoleElement.isUserOrgManager(guidManagerOrgX)).toBe(false);
      });
    });
  });

  describe('Testing org user roles', function () {
    it('Setup userRoleElement', function () {
      browser.url(urlOrgX);
      browser.waitForExist('.test-users');
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
    });

    describe('As org manager Y', function () {
      beforeEach(function () {
        // sets cookie to org Y manager
        cookieValue = cookieManagerOrgY;
      });

      describe('shouldn\'t have permission to edit fields on org X pages', function () {
        it('should set url to org X', function () {
          browser.url(urlOrgX);
        });

        it('verifies that the current user is a user with only permissions to org Y', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgY);
        });

        it('verify org Y manager cannot modify org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(false);
        });
      });

      describe('should have permission to edit fields on org Y pages', function () {
        it('should set url to org Y', function () {
          browser.url(urlOrgY);
        });

        it('verifies that the current user is a user with only permissions to org Y', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgY);
        });

        it('verify org Y manager can modify org Y page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(true);
        });
      });
    });

    describe('As org manager X', function () {
      beforeEach(function () {
        // sets cookie to org X manager
        cookieValue = cookieManagerOrgX;
      });
      describe('shouldn\'t have permission to edit fields on org Y pages', function () {
        it('should set url to org Y', function () {
          browser.url(urlOrgY);
        });

        it('verifies that the current user is a user with only permissions to org X', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgX);
        });

        it('verify org X manager cannot modify org Y page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(false);
        });
      });

      describe('should have permission to edit fields on org X pages', function () {
        it('should set url to org X', function () {
          browser.url(urlOrgX);
        });

        it('verifies that the current user is a user with only permissions to org X', function () {
          cookieResult = userRoleElement.getUserRole(cookieManagerOrgX);
          expect(cookieResult).toBe(cookieManagerOrgX);
        });

        it('verify org X manager can modify org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(true);
        });
      });
    });

    it('delete cookie after', function () {
      browser.deleteCookie('testing_user_role');
    });
  });

  describe('A user on page for a space', function () {
    describe('for org X space XX, should see only manager XX has user permissions', function () {
      it('should navigates to org X space XX', function () {
        browser.url(urlOrgXSpaceXX);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should see user XX has Space Manager access for space XX', function () {
        expect(userRoleElement.isUserSpaceManager(guidManagerOrgXSpaceXX)).toBe(true);
      });

      it('should see user YY does not have Space Manager access for space XX', function () {
        expect(userRoleElement.isUserSpaceDeveloper(guidManagerOrgXSpaceYY)).toBe(false);
      });
    });

    describe('for org X space YY, should see only manager YY has user permissions', function () {
      it('should navigates to org X space YY', function () {
        browser.url(urlOrgXSpaceYY);

        browser.waitForExist('.test-users');
        userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should see user XX does not have Space Manager access for space YY', function () {
        expect(userRoleElement.isUserSpaceManager(guidManagerOrgXSpaceXX)).toBe(false);
      });

      it('should see user YY has Space Manager access for space YY', function () {
        expect(userRoleElement.isUserSpaceDeveloper(guidManagerOrgXSpaceYY)).toBe(true);
      });
    });
  });

  describe('Testing space user roles', function () {
    it('Setup userRoleElement', function () {
      browser.url(urlOrgXSpaceXX);
      browser.waitForExist('.test-users');
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
    });

    describe('As space manager org X space XX ', function () {
      beforeEach(function () {
        // sets cookie to space manager XX
        cookieValue = cookieManagerOrgXSpaceXX;
      });

      describe('shouldn\'t have permission to edit fields on space YY org X pages', function () {
        it('should set url to org X space YY', function () {
          browser.url(urlOrgXSpaceYY);
        });

        it('verifies that the current user is a user with only' +
        'permissions to org X space YY', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgXSpaceXX);
        });

        it('verify space manager org X space XX cannot modify space YY org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(false);
        });
      });

      describe('should have permission to edit fields on space XX org X pages', function () {
        it('should set url to org X space XX', function () {
          browser.url(urlOrgXSpaceXX);
        });

        it('verifies that the current user is a user with only permissions to org Y', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgXSpaceXX);
        });

        it('verify space manager org X space XX can modify space XX org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(true);
        });
      });
    });

    describe('As space manager org X space YY', function () {
      beforeEach(function () {
        // sets cookie to space manager YY
        cookieValue = cookieManagerOrgXSpaceYY;
      });
      describe('shouldn\'t have permission to edit fields on org X space XX pages', function () {
        it('should set url to org Y', function () {
          browser.url(urlOrgXSpaceXX);
        });

        it('verifies that the current user is a user with only permissions to org X', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgXSpaceYY);
        });

        it('verify org X manager cannot modify org Y page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(false);
        });
      });

      describe('should have permission to edit fields on org X space YY pages', function () {
        it('should set url to org X space YY', function () {
          browser.url(urlOrgXSpaceYY);
        });

        it('verifies that the current user is a user with only permissions to' +
          ' org X space YY', function () {
          cookieResult = userRoleElement.setAndGetUserRole(cookieValue);
          expect(cookieResult).toBe(cookieManagerOrgXSpaceYY);
        });

        it('verify space manager org X space YY can modify space YY org X page', function () {
          expect(userRoleElement.isFirstUserRoleEnabled()).toBe(true);
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
