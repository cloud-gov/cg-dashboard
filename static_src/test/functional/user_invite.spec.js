
import UserInviteElement from './pageobjects/user_invite.element';
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let userInviteElement;
  let userRoleElement;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

  const email = 'fake-new-user@domain.com';
  const cookieManagerOrgX = 'org_manager_org_x';
  const urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('A user on page for an org', function () {
    it('should navigates to org X', function () {
      browser.url(urlOrgX);
      browser.waitForExist('.test-users');
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
      userRoleElement.setUserRole(cookieManagerOrgX);
    });

    it('should have the user invite panel', function () {
      browser.url(urlOrgX);

      browser.waitForExist('.test-users-invite');
      userInviteElement = new UserInviteElement(browser,
        browser.element('.test-users-invite'));

      expect(userInviteElement.isVisible()).toBe(true);
    });

    it('should be able to input content into invite form', function () {
      userInviteElement.inputToInviteForm(email);

      expect(email).toBe(userInviteElement.getInviteFormValue());
    });

    it('should be able to submit an email address and see on user list', function () {
      const existingUserCount = userInviteElement.countNumberOfUsers();
      const user = userInviteElement.getUserByIndex(existingUserCount - 1);
      expect(user.getText()).not.toMatch(/fake-persona@gsa.gov/);
      userInviteElement.inputToInviteForm(email);
      userInviteElement.submitInviteForm();
      const currentUserCount = userInviteElement.countNumberOfUsers();
      expect(currentUserCount).toEqual(existingUserCount + 1);
    });

    it('should add the user as the last entry in the user list', function () {
      const currentUserCount = userInviteElement.countNumberOfUsers();
      const user = userInviteElement.getUserByIndex(currentUserCount - 1);
      expect(user.getText()).toMatch(/fake-persona@gsa.gov/);
    });

    it('should display an error message if the email address is invalid',
    function () {
      const invalidEmail = '123';
      userInviteElement.inputToInviteForm(invalidEmail);
      userInviteElement.submitInviteForm();
      expect(userInviteElement.getErrorMessage()).toMatch(invalidEmail);
    });
  });
});
