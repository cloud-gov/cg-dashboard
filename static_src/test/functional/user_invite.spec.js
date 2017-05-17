
import UserInviteElement from './pageobjects/user_invite.element';
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let userInviteElement,
    userRoleElement;

  const email = 'fake-new-user@domain.com',
    cookieManagerOrgX = 'org_manager_org_x',
    errorMessage = "There were errors submitting the form.",
    urlOrgX = '/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';

  describe('A user on page for an org', function () {
    it('should navigates to org X', function () {
      browser.url(urlOrgX);
      userRoleElement = new UserRoleElement(browser, browser.element('.test-users'));
      userRoleElement.setUserRole(cookieManagerOrgX);

      browser.url(urlOrgX);
      browser.waitForExist('.test-users');

      expect(browser.isExisting('.test-users')).toBe(true);
    });

    it('should have the user invite panel', function () {
      userInviteElement = new UserInviteElement(browser, browser.element('.test-users-invite'));
      browser.waitForExist('.test-users-invite');

      expect(userInviteElement.isVisible()).toBe(true);
    });

    it('should not be able to submit without email', function () {
      userInviteElement.submitInviteForm().then( function(e) {
      console.log('Submit Search Form');
    })
    .waitForVisible("#users-invite-form .error_message", 10000).then(function (e) {
      expect(errorMessage).toBe($('.error_message').getText());
    });

    it('should be able to input content into invite form', function () {
      userInviteElement.inputToInviteForm(email);

      expect(email).toBe(userInviteElement.getInviteFormValue());
    });

    it('should be able to input content into invite form', function () {
      userInviteElement.inputToInviteForm(email);

      expect(email).toBe(userInviteElement.getInviteFormValue());
    });


    it('should be able to submit content and see response', function () {
      userInviteElement.submitInviteForm().then( function(e) {
      console.log('Submit Search Form');
    })
    .waitForVisible("#search-results", 10000).then(function (e) {
      console.log('Search Results Found');
    });ch

      expect(email).toBe(userInviteElement.getInviteFormValue());
    });
  });
});
