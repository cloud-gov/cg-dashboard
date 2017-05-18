
import UserInviteElement from './pageobjects/user_invite.element';
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let userInviteElement;
  let userRoleElement;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  const email = 'fake-new-user@domain.com';
  const cookieManagerOrgX = 'org_manager_org_x';
  const errorMessage = 'There were errors submitting the form.';
  const urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('A user on page for an org', function () {
    it('should navigates to org X', function () {
      browser.url(urlOrgX);
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
      userRoleElement.setUserRole(cookieManagerOrgX);

      expect(browser.isExisting('.test-users')).toBe(true);
    });

    it('should have the user invite panel', function () {
      browser.url(urlOrgX);

      userInviteElement = new UserInviteElement(browser,
        browser.element('.test-users-invite'));
      browser.waitForExist('.test-users-invite');

      expect(userInviteElement.isVisible()).toBe(true);
    });

    it('should be able to input content into invite form', function () {
      userInviteElement.inputToInviteForm(email);

      expect(email).toBe(userInviteElement.getInviteFormValue());
    });

    it('should be able to submit an email address and see the user added to the user list',
      function () {
      const existingUserCount = userInviteElement.countNumberOfUsers();
      userInviteElement.inputToInviteForm(email);
      userInviteElement.submitInviteForm();
      const currentUserCount = userInviteElement.countNumberOfUsers();
      expect(currentUserCount).toEqual(existingUserCount + 1);
    });
  });
});
