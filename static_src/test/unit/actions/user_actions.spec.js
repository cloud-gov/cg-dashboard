
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupUISpy, setupServerSpy } from
  '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import uaaApi from '../../../util/uaa_api.js';
import userActions from '../../../actions/user_actions.js';
import { userActionTypes } from '../../../constants.js';
import UserStore from '../../../stores/user_store';
import OrgStore from '../../../stores/org_store';

describe('userActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchOrgUsers()', function() {
    it('should dispatch a view event of type org users fetch', function() {
      var expectedOrgGuid = 'asdflkjz',
          expectedParams = {
            orgGuid: expectedOrgGuid
          };

      let spy = setupViewSpy(sandbox);

      userActions.fetchOrgUsers(expectedOrgGuid);

      assertAction(spy, userActionTypes.ORG_USERS_FETCH, expectedParams);
    });
  });

  describe('fetchOrgUserRoles()', function() {
    it('should dispatch a view event of type org user roles fetch', function() {
      var expectedOrgGuid = 'zknxvzmnxjkafakdlsxcv',
          expectedParams = {
            orgGuid: expectedOrgGuid
          };

      let spy = setupViewSpy(sandbox);

      userActions.fetchOrgUserRoles(expectedOrgGuid);

      assertAction(spy, userActionTypes.ORG_USER_ROLES_FETCH, expectedParams);
    });
  });

  describe('fetchSpaceUsers()', function() {
    it('should dispatch a view event of type space users fetch', function() {
      var expectedSpaceGuid = 'asdflkjz',
          expectedParams = {
            spaceGuid: expectedSpaceGuid
          };

      let spy = setupViewSpy(sandbox);

      userActions.fetchSpaceUsers(expectedSpaceGuid);

      assertAction(spy, userActionTypes.SPACE_USERS_FETCH, expectedParams);
    });
  });

  describe('receivedOrgUsers()', function() {
    it(`should dispatch a server event of type org users received with received
        data`, function() {
      var expected = [{ entity: { }, metadata: { guid: 'adf' }}],
          expectedParams = {
            users: expected
          };

      let spy = setupServerSpy(sandbox)

      userActions.receivedOrgUsers(expected);

      assertAction(spy, userActionTypes.ORG_USERS_RECEIVED, expectedParams);
    });
  });

  describe('receivedOrgUserRoles()', function() {
    it('should dispatch a view event of type org user roles fetch', function() {
      var expectedOrgGuid = 'zknxvzmnxjkafakdlsxcv',
          expectedOrgRoles = [{ metadata: {guid: 'zxcvz'}, entity: { }}],
          expectedParams = {
            orgUserRoles: expectedOrgRoles,
            orgGuid: expectedOrgGuid
          };

      let spy = setupServerSpy(sandbox);

      userActions.receivedOrgUserRoles(expectedOrgRoles, expectedOrgGuid);

      assertAction(spy, userActionTypes.ORG_USER_ROLES_RECEIVED, expectedParams);
    });
  });

  describe('receivedSpaceUsers()', function() {
    it(`should dispatch a server event of type space users received with received
        data`, function() {
      var expected = [{ entity: { }, metadata: { guid: 'adf' }}],
          expectedParams = {
            users: expected
          };

      let spy = setupServerSpy(sandbox)

      userActions.receivedSpaceUsers(expected);

      assertAction(spy, userActionTypes.SPACE_USERS_RECEIVED, expectedParams);
    });
  });

  describe('deleteUser()', function() {
    it('should dispatch a view event of type user delete with user guid',
        function() {
      var expectedUserGuid = 'adsklfjanmxcv',
          expectedOrgGuid = 'sdkjfcmxxzcxvzz',
          expectedParams = {
            userGuid: expectedUserGuid,
            orgGuid: expectedOrgGuid
          };

      let spy = setupViewSpy(sandbox)

      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      assertAction(spy, userActionTypes.USER_DELETE, expectedParams);
    })
  });

  describe('deletedUser()', function() {
    it('should dispatch a server event of type user deleted with user guid',
        function() {
      var expectedUserGuid = 'klfjanmxcvasfzcv',
          expectedOrgGuid = '0909uasdifhnmzxcv',
          expectedParams = {
            userGuid: expectedUserGuid,
            orgGuid: expectedOrgGuid
          };

      let spy = setupServerSpy(sandbox)

      userActions.deletedUser(expectedUserGuid, expectedOrgGuid);

      assertAction(spy, userActionTypes.USER_DELETED, expectedParams);
    })
  });

  describe('errorRemoveUser()', function() {
    it('should call a server action for remove error', function() {
      var expectedUserGuid = 'klfjanmxcvasfzcv',
          expectedError = { code: 10006, message: 'something bad' },
          expectedParams = {
            userGuid: expectedUserGuid,
            error: expectedError
          };

      let spy = setupServerSpy(sandbox)

      userActions.errorRemoveUser(expectedUserGuid, expectedError);

      assertAction(spy, userActionTypes.ERROR_REMOVE_USER, expectedParams);
    });
  });

  describe('fetchUserOrgs()', function () {
    let userGuid;

    beforeEach(function (done) {
      userGuid = 'user123';
      sandbox.stub(cfApi, 'fetchUserOrgs').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleViewAction');

      userActions.fetchUserOrgs(userGuid)
        .then(done, done.fail);
    });

    it('dispatches USER_ORGS_FETCH', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_ORGS_FETCH,
        userGuid
      }));
    });

    it('calls cfApi', function () {
      expect(cfApi.fetchUserOrgs).toHaveBeenCalledOnce();
      expect(cfApi.fetchUserOrgs).toHaveBeenCalledWith(userGuid);
    });
  });

  describe('fetchUserInvite', function () {
    let email;

    beforeEach(function (done) {
      email = 'name@place.com';
      sandbox.stub(uaaApi, 'inviteUaaUser').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleViewAction');
      sandbox.stub(userActions, 'receiveUserInvite').returns(Promise.resolve());

      userActions.fetchUserInvite(email).then(done, done.fail);
    });

    it('should trigger the invite action for new user email', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_INVITE_FETCH,
        email
      }));
    });

    it('calls uaaApi inviteUaaUser', function () {
      expect(uaaApi.inviteUaaUser).toHaveBeenCalledWith(email);
    });

    describe('when request fails', function() {
      beforeEach(function (done) {
        uaaApi.inviteUaaUser.returns(Promise.reject({}));
        sandbox.spy(userActions, 'userInviteError');

        userActions.fetchUserInvite(email).then(done, done.fail);
      });

      it('should call user invite error action handler', function() {
        expect(userActions.userInviteError).toHaveBeenCalledOnce();
      });
    });
  });

  describe('receiveUserInvite', function () {
    let userGuid;
    let inviteData;

    beforeEach(function (done) {
      userGuid = "fake-udid";
      inviteData = { new_invites: [{ userId: userGuid }] };
      sandbox.stub(cfApi, 'postCreateNewUserWithGuid').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleServerAction');
      sandbox.stub(userActions, 'receiveUserForCF').returns(Promise.resolve());
      userActions.receiveUserInvite(inviteData)
        .then(done, done.fail);
    });

    it('should send off the email invite', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_INVITE_RECEIVED
      }));
    });

    it('calls cfApi postCreateNewUserWithGuid', function () {
      expect(cfApi.postCreateNewUserWithGuid).toHaveBeenCalledWith(userGuid);
    });
  });

  describe('receiveUserForCF', function () {
    let userGuid;
    let user;
    let inviteData;
    beforeEach(function (done) {
      userGuid = "fake-udid";
      user = { guid: userGuid };
      inviteData = { new_invites:[{ userId: userGuid }] };
      sandbox.stub(userActions, 'sendUserInviteEmail').returns(Promise.resolve());
      sandbox.stub(userActions, 'associateUserToOrg').returns(Promise.resolve());
      sandbox.stub(AppDispatcher, 'handleServerAction');
      userActions.receiveUserForCF(user, inviteData)
        .then(done, done.fail);
    });

    it('confirms the user was created and returns a guid', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_IN_CF_CREATED,
        user
      }));
    });

    it('should send off email invite with invite data', function () {
      expect(userActions.sendUserInviteEmail).toHaveBeenCalledOnce();
    });

    it('should call next request to associate user', function () {
      expect(userActions.associateUserToOrg).toHaveBeenCalledOnce();
    });
  });

  describe('sendUserInviteEmail', function () {
    let userGuid;
    let inviteData;
    let spy;
    beforeEach(function () {
      userGuid = "fake-user-udid";
      inviteData = { new_invites: [{ userId: userGuid }] };
      spy = setupServerSpy(sandbox);

      sandbox.stub(uaaApi, 'sendInviteEmail');
      userActions.sendUserInviteEmail(inviteData);
    });

    it('should announce email invite to actions', function () {
      assertAction(spy, userActionTypes.USER_EMAIL_INVITE);
    });

    it('should trigger request for invite email', function () {
      expect(uaaApi.sendInviteEmail).toHaveBeenCalledOnce();
    });
  });

  describe('associateUserToOrg', function () {
    let user;
    let userGuid;
    let orgGuid;
    beforeEach(function (done) {
      userGuid = "fake-udid";
      orgGuid = "fake-org-guid";
      user = { guid: userGuid };
      sandbox.stub(OrgStore, 'get').returns(orgGuid);
      sandbox.stub(cfApi, 'putAssociateUserToOrganization').returns(Promise.resolve());
      sandbox.stub(userActions, 'associatedUserToOrg').returns(Promise.resolve());
      sandbox.stub(AppDispatcher, 'handleServerAction');
      userActions.associateUserToOrg(user)
        .then(done, done.fail);
    });

    it('completes the association to user and org', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_ORG_ASSOCIATE
      }));
    });

    it('should trigger cf api to make put request to associate user', function () {
      expect(cfApi.putAssociateUserToOrganization).toHaveBeenCalledOnce();
    });

    it('should call associatedUser confirmation after', function () {
      expect(userActions.associatedUserToOrg).toHaveBeenCalledOnce();
    });
  });

  describe('associatedUserToOrg', function () {
    it('should dispatch USER_ORG_ASSOCIATED notice with user and org', function() {
      var user = { guid: "fake-udid" },
          orgGuid = "fake-org-udid";

      let expectedParams = {
        user: user,
        orgGuid: orgGuid
      };

      let spy = setupServerSpy(sandbox);

      userActions.associatedUserToOrg(user, orgGuid);

      assertAction(spy, userActionTypes.USER_ORG_ASSOCIATED, expectedParams);
    });
  });

  describe('addUserRoles()', function() {
    it(`should call a view action to add user roles with current roles
        user guid and guid and type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'akdfjadzxcvzxcvzxvzx',
          expectedGuid = '2eve2v2vadsfa',
          expectedType = 'org';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        resourceGuid: expectedGuid,
        resourceType: expectedType
      };

      let spy = setupViewSpy(sandbox)

      userActions.addUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_ADD, expectedParams);
    });
  });

  describe('addedUserRoles()', function() {
    it(`should call a server action to add user roles with roles user guid and
        resource type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'azxcvoiuzxcvzxcvzxvzx',
          expectedType = 'organization';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        resourceType: expectedType
      };

      let spy = setupServerSpy(sandbox)

      userActions.addedUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_ADDED, expectedParams);
    });
  });

  describe('deleteUserRoles()', function() {
    it(`should call a view action to remove user roles with current roles
        user guid and org guid and type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'akdfjasdfjasdfadzxcvzxcvzxvzx',
          expectedGuid = '2eve2dsfa',
          expectedType = 'space';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        resourceGuid: expectedGuid,
        resourceType: expectedType
      };

      let spy = setupViewSpy(sandbox)

      userActions.deleteUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_DELETE, expectedParams);
    });
  });

  describe('deletedUserRoles()', function() {
    it(`should call a server action to add user roles with roles user guid and
        resource type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'azxcvoiuzxcvzxcvzxvzx',
          expectedType = 'organization';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        resourceType: expectedType
      };

      let spy = setupServerSpy(sandbox)

      userActions.deletedUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_DELETED, expectedParams);
    });
  });

  describe('changeCurrentlyViewedType()', function() {
    it('should call a ui action for changing currently viewed type', function() {
      var expectedUserType = 'space',
          expectedParams = {
            userType: expectedUserType
          };

      let spy = setupUISpy(sandbox);

      userActions.changeCurrentlyViewedType(expectedUserType);

      assertAction(spy, userActionTypes.USER_CHANGE_VIEWED_TYPE,
        expectedParams);
    });
  });

  describe('receivedCurrentUserInfo()', function() {
    it('should call a server action with user object passed in', function() {
      const user = { user_id: 'zcxvkjadsuf', user_name: 'john' };
      const expectedParams = {
        currentUser: user
      };
      let spy = setupServerSpy(sandbox);

      userActions.receivedCurrentUserInfo(user);

      assertAction(spy, userActionTypes.CURRENT_USER_INFO_RECEIVED,
        expectedParams);
    });
  });

  describe('fetchUser()', function () {
    let userGuid;

    beforeEach(function () {
      userGuid = 'user123';
      sandbox.stub(AppDispatcher, 'handleViewAction');
      userActions.fetchUser(userGuid);
    });

    it('dispatches view', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_FETCH,
        userGuid
      }));
    });

    describe('given no userGuid', function () {
      let result;
      beforeEach(function (done) {
        userActions.fetchUser()
          .catch(_result => {
            result = _result;
            done();
          });
      });

      it('rejects', function () {
        expect(result).toEqual(new Error('userGuid is required'));
      });
    });
  });

  describe('receivedUser()', function () {
    let user;
    beforeEach(function (done) {
      user = { guid: 'user123' };
      sandbox.stub(AppDispatcher, 'handleServerAction');
      userActions.receivedUser(user)
        .then(done, done.fail);
    });

    it('dispatches action', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_RECEIVED,
        user
      }));
    });
  });

  describe('fetchUserSpaces()', function () {
    let userGuid;

    beforeEach(function (done) {
      userGuid = 'user123';
      sandbox.stub(cfApi, 'fetchUserSpaces').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleViewAction');

      userActions.fetchUserSpaces(userGuid)
        .then(done, done.fail);
    });

    it('dispatches USER_SPACES_FETCH', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_SPACES_FETCH,
        userGuid
      }));
    });

    it('calls cfApi', function () {
      expect(cfApi.fetchUserSpaces).toHaveBeenCalledWith(userGuid);
    });

    describe('given orgGuid', function () {
      let orgGuid;
      beforeEach(function (done) {
        orgGuid = 'org123';

        userActions.fetchUserSpaces(userGuid, { orgGuid })
          .then(done, done.fail);
      });

      it('dispatches USER_SPACES_FETCH with orgGuid', function () {
        expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith({
          type: userActionTypes.USER_SPACES_FETCH,
          userGuid,
          orgGuid
        });
      });

      it('calls api with orgGuid', function () {
        expect(cfApi.fetchUserSpaces).toHaveBeenCalledWith(userGuid, sinon.match({ orgGuid }));
      });
    });
  });

  describe('receivedUserSpaces()', function () {
    let userGuid, userSpaces, result;

    beforeEach(function (done) {
      userGuid = 'user123';
      userSpaces = [{ guid: 'space123' }, { guid: 'space456' }];
      sandbox.stub(AppDispatcher, 'handleServerAction');

      userActions.receivedUserSpaces(userGuid, userSpaces)
        .then(_result => {
          result = _result;
        })
        .then(done, done.fail);
    });

    it('dispatches USER_SPACES_RECEIVED', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_SPACES_RECEIVED,
        userGuid,
        userSpaces
      }));
    });

    it('resolves the userSpaces', function () {
      expect(result).toEqual(userSpaces);
    });
  });

  describe('fetchUserOrgs()', function () {
    let userGuid;

    beforeEach(function (done) {
      userGuid = 'user123';
      sandbox.stub(cfApi, 'fetchUserOrgs').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleViewAction');

      userActions.fetchUserOrgs(userGuid)
        .then(done, done.fail);
    });

    it('dispatches USER_ORGS_FETCH', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_ORGS_FETCH,
        userGuid
      }));
    });

    it('calls cfApi', function () {
      expect(cfApi.fetchUserOrgs).toHaveBeenCalledOnce();
      expect(cfApi.fetchUserOrgs).toHaveBeenCalledWith(userGuid);
    });
  });

  describe('receivedUserOrgs()', function () {
    let userGuid, userOrgs, result;

    beforeEach(function (done) {
      userGuid = 'user123';
      userOrgs = [{ guid: 'org123' }, { guid: 'org456' }];
      sandbox.stub(AppDispatcher, 'handleServerAction');

      userActions.receivedUserOrgs(userGuid, userOrgs)
        .then(_result => {
          result = _result;
        })
        .then(done, done.fail);
    });

    it('dispatches USER_ORGS_RECEIVED', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_ORGS_RECEIVED,
        userGuid,
        userOrgs
      }));
    });

    it('resolves the userOrgs', function () {
      expect(result).toEqual(userOrgs);
    });
  });


  describe('fetchCurrentUserUaaInfo()', function () {
    let guid;

    beforeEach(function (done) {
      guid = 'user123';
      sandbox.stub(uaaApi, 'fetchUaaInfo').returns(Promise.resolve([]));
      sandbox.stub(AppDispatcher, 'handleViewAction');

      userActions.fetchCurrentUserUaaInfo(guid)
        .then(done, done.fail);
    });

    it('dispatches CURRENT_UAA_INFO_FETCH', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.CURRENT_UAA_INFO_FETCH
      }));
    });

    it('calls uaaApi', function () {
      expect(uaaApi.fetchUaaInfo).toHaveBeenCalledWith(guid);
    });
  });

  describe('receivedCurrentUserUaaInfo()', function() {
    it('should call a server action with user object passed in', function() {
      const uaaStub = { uaaInfo: {} };
      const expectedParams = {};
      let spy = setupServerSpy(sandbox);

      userActions.receivedCurrentUserUaaInfo(uaaStub);

      assertAction(spy, userActionTypes.CURRENT_UAA_INFO_RECEIVED,
        expectedParams);
    });
  });

  describe('fetchCurrentUser()', function () {
    beforeEach(function (done) {
      sandbox.stub(userActions, 'fetchCurrentUserInfo')
        .returns(Promise.resolve({ user_id: 'user123' }));
      sandbox.stub(userActions, 'fetchUser').returns(Promise.resolve());
      sandbox.stub(userActions, 'fetchUserOrgs').returns(Promise.resolve());
      sandbox.stub(userActions, 'fetchUserSpaces').returns(Promise.resolve());
      sandbox.stub(userActions, 'fetchCurrentUserUaaInfo').returns(Promise.resolve());
      sandbox.stub(userActions, 'receivedCurrentUser').returns(Promise.resolve());
      sandbox.stub(AppDispatcher, 'handleViewAction');

      // We really want to stub UserStore.currentUser here but there's no way
      // to do it. Not sure how to get sinon to stub ES6 properties. Would be
      // nice if the stores were not global singletons or if there was a way to
      // register our own store for the test.
      sandbox.stub(UserStore, 'get').returns({ guid: 'user123' });

      userActions.fetchCurrentUser().then(done, done.fail);
    });

    it('dispatches the action', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.CURRENT_USER_FETCH
      }));
    });

    it('calls fetchCurrentUserInfo', function () {
      expect(userActions.fetchCurrentUserInfo).toHaveBeenCalledOnce();
    });

    it('calls fetchCurrentUserUaaInfo', function () {
      expect(userActions.fetchCurrentUserUaaInfo).toHaveBeenCalledOnce();
    });

    it('calls fetchUser', function () {
      expect(userActions.fetchUser).toHaveBeenCalledOnce();
    });

    it('calls fetchUserSpaces', function () {
      expect(userActions.fetchUserSpaces).toHaveBeenCalledOnce();
    });

    it('calls receivedCurrentUser', function () {
      expect(userActions.receivedCurrentUser).toHaveBeenCalledWith({ guid: 'user123' });
    });

  });
});
