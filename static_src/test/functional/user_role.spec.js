
describe('User roles', function () {
  let cookieResult;

  beforeEach(function () {
    browser.url('/');
  });

  afterEach(function () {
    browser.deleteCookie('testing_user_role');
  });

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
    it('has a title', function () {
      browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
      expect(browser.getTitle()).toBe('cloud.gov dashboard');
    });

    it('has a page header', function () {
      browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('fake-cf-user_role-org_x-testing');
    });

    describe('org manager for org X then they should', function () {
      it('be able to edit roles for org X', function () {
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_x' });
        browser.url('/');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_x');

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

  describe('Space page', function () {
  //   it('navigates to a org\'s space page', function () {
  //     const orgGuid = '48b3f8a1-ffe7-4aa8-8e85-94768d6bd250';
  //     const spaceGuid = '82af0edb-8540-4064-82f2-d74df612b794';
  //     browser.url(`/#/org/${orgGuid}/spaces/${spaceGuid}`);
  //   });

  //   it('has a page header', function () {
  //     const pageHeader = browser.element('.test-page-header-title');
  //     expect(pageHeader.getText()).toBe('fake-dev');
  //   });

  //   describe('space manager for space XX then they should', function () {
  //     it('be able to edit roles for space XX', function () {
  //       browser.setCookie({ name: 'testing_user_role', value: 'space_manager_space_xx' });
  //       browser.url('/uaa/userinfo');
  //       cookieResult = browser.getCookie('testing_user_role').value;
  //       expect(cookieResult).toBe('space_manager_space_xx');

  //       browser.deleteCookie('testing_user_role');
  //       browser.url('/uaa/userinfo');
  //       cookieResult = browser.getCookie('testing_user_role');

  //       expect(cookieResult).toBeFalsy();
  //     });

  //     it('not be able to edit roles for space YY', function () {
  //       expect(true).toBe(true);
  //     });
  //   });
  });
});
