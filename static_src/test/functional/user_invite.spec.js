
import UserInviteElement from './pageobjects/user_invite.element';
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let userInviteElement,
    userRoleElement;

  const email = 'name@domain.com',
    cookieManagerOrgX = 'org_manager_org_x',
    urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('A user on page for an org', function () {
    it('should navigates to org X', function () {
      browser.url(urlOrgX);

      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
      userRoleElement.setUserRole(cookieManagerOrgX);

      browser.waitForExist('.test-users');
      expect(browser.isExisting('.test-users')).toBe(true);
    });

    it('should have the user invite panel', function () {
      userInviteElement = new UserInviteElement(browser, browser.element('.test-users-invite'));
      browser.waitForExist('.test-users-invite');

      expect(userInviteElement.isVisible()).toBe(true);
    });

    it('should be able to input content into invite form', function () {
      userInviteElement.inputToInviteForm(email);
      expect(email).toBe(userInviteElement.getInviteFormValue());
    });
  });
});
