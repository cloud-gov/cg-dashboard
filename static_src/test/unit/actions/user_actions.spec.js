
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupUISpy, setupServerSpy } from
  '../helpers.js';
import moxios from 'moxios';
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
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
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

  describe('fetchSpaceUserRoles()', function() {
    it('should dispatch a view event of type space users fetch', function() {
      var expectedSpaceGuid = 'asdflkjz',
          expectedParams = {
            spaceGuid: expectedSpaceGuid
          };

      let spy = setupViewSpy(sandbox);

      userActions.fetchSpaceUserRoles(expectedSpaceGuid);

      assertAction(spy, userActionTypes.SPACE_USER_ROLES_FETCH, expectedParams);
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

  describe('receivedSpaceUserRoles()', function() {
    it(`should dispatch a server event of type space users received with received
        data`, function() {
      var expected = [{ entity: { }, metadata: { guid: 'adf' }}],
          expectedParams = {
            users: expected
          };

      let spy = setupServerSpy(sandbox)

      userActions.receivedSpaceUserRoles(expected);

      assertAction(spy, userActionTypes.SPACE_USER_ROLES_RECEIVED, expectedParams);
    });
  });

  describe('receivedOrgSpacesToExtractSpaceUsers()', function() {
    let orgSpace;
    let orgSpaces;

    beforeEach(function () {
      orgSpace = { guid: 'org-guid-this-is'};

      sandbox.stub(cfApi, 'fetchSpaceUserRoles')
        .returns(Promise.resolve({ guid: '' }));
    });

    it('calls receivedOrgSpacesToExtractSpaceUsers once when org has one space', function (done) {
      orgSpaces = [orgSpace];
      userActions.receivedOrgSpacesToExtractSpaceUsers(orgSpaces).then(done, done.fail);
      expect(cfApi.fetchSpaceUserRoles).toHaveBeenCalledOnce();
    });

    it('calls receivedOrgSpacesToExtractSpaceUsers three times when org has three spaces', function (done) {
      orgSpaces = [orgSpace, orgSpace, orgSpace];
      userActions.receivedOrgSpacesToExtractSpaceUsers(orgSpaces).then(done, done.fail);
      expect(cfApi.fetchSpaceUserRoles).toHaveBeenCalledThrice();
    });
  });

  describe('fetchUserAssociationsToOrgSpaces()', function() {
    let userGuid;
    let orgGuid;
    let user;
    let users;
    let orgSpace;
    let orgSpaces;

    beforeEach(function (done) {
      userGuid = 'user-guid';
      orgGuid = 'org-guid';
      user = { guid: 'user-guid-this-is' };
      users = [user, user, user];
      orgSpace = { guid: 'org-guid-this-is' };
      orgSpaces = [orgSpace, orgSpace, orgSpace];

      sandbox.stub(userActions, 'receivedOrgSpacesToExtractSpaceUsers')
        .returns(Promise.resolve(users));
      sandbox.stub(cfApi, 'fetchAllOrgSpaces')
        .returns(Promise.resolve(orgSpaces));

      userActions.fetchUserAssociationsToOrgSpaces(userGuid, orgGuid).then(done, done.fail);;
    });

    it(`should call cfApi.fetchAllOrgSpaces`, function() {
      expect(cfApi.fetchAllOrgSpaces).toHaveBeenCalledOnce();
    });

    it(`should call userActions.receivedOrgSpacesToExtractSpaceUsers`, function() {
      expect(userActions.receivedOrgSpacesToExtractSpaceUsers).toHaveBeenCalledOnce();
    });
  });

  describe('deleteUserIfNoSpaceAssociation()', function() {
    it(``, function() {
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

      let spy = setupViewSpy(sandbox);

      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      assertAction(spy, userActionTypes.USER_DELETE, expectedParams);
    });
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

  describe('createUserInvite()', function() {
    it(`should dispatch a view event to process a email invite request`, function() {
      var email = 'this@there.com';
      var expected = { email: email };
      var user = { userGuid: 'user-guid' };

      let spy = setupViewSpy(sandbox);
      sandbox.stub(uaaApi, 'inviteUaaUser').returns(Promise.resolve(user));
      sandbox.spy(userActions, 'receivedInviteStatus');
      userActions.createUserInvite(email);

      assertAction(spy, userActionTypes.USER_INVITE_TRIGGER, expected);
    });
  });

  describe('receivedInviteStatus()', function() {
    it('should', function() {
      var userGuid = "user-guid";
      var invite = { userGuid };
      var email = 'this@there.com';
      var verified = true;
      var expected = { email, verified };

      sandbox.spy(userActions, 'receivedInviteStatus');
      sandbox.stub(userActions, 'createUserAndAssociate').returns(Promise.resolve(invite));
      sandbox.stub(userActions, 'createInviteNotification');
      sandbox.stub(uaaApi, 'inviteUaaUser').returns(Promise.resolve(invite));
      let spy = setupViewSpy(sandbox)

      userActions.receivedInviteStatus(invite, email);

      assertAction(spy, userActionTypes.USER_INVITE_STATUS_UPDATED);
    });
  });

  describe('clearUserListNotifications()', function() {
    it('should dispatch a view event of type clear invite notification', function() {
      let spy = setupViewSpy(sandbox);

      userActions.clearUserListNotifications();

      assertAction(spy, userActionTypes.USER_LIST_NOTICE_DISMISSED);
    });
  });

  describe('createInviteNotification()', function() {
    let verified, email, noticeType, description;

    beforeEach(function () {
      email = 'this@that.com';
      noticeType = 'finish';
      description = '';
      // We really want to stub UserStore.currentUser here but there's no way
      // to do it. Not sure how to get sinon to stub ES6 properties. Would be
      // nice if the stores were not global singletons or if there was a way to
      // register our own store for the test.
      sandbox.stub(UserStore, 'get').returns('org_user');
    });

    it('should dispatch a view event of type create invite notification with false', function(done) {
      description = 'An email invite was sent to this@that.com. Their account has been associated to this space, and their space roles can be controlled below.';
      var expected = {
        noticeType,
        description
      };
      let spy = setupViewSpy(sandbox);
      sandbox.spy(userActions, 'receivedInviteStatus');
      userActions.createInviteNotification(false, email);
      assertAction(spy, userActionTypes.USER_LIST_NOTICE_CREATED, expected);
      done();
    });

    it('should dispatch a view event of type create invite notification with true', function(done) {
      description =  'The cloud.gov account for this@that.com is now associated to this space. Control their space roles below.';
      var expected = {
        noticeType,
        description
      };
      let spy = setupViewSpy(sandbox);
      sandbox.spy(userActions, 'receivedInviteStatus');
      userActions.createInviteNotification(true, email);
      assertAction(spy, userActionTypes.USER_LIST_NOTICE_CREATED, expected);
      done();
    });
  });

  describe('userListNoticeError()', function() {
    let err;
    let message;

    beforeEach(function(done) {
      err = { status: 502 };
      message = 'something happened when invititing';
      sandbox.stub(AppDispatcher, 'handleServerAction');

      userActions.userListNoticeError(err, message).then(done, done.fail);
    });

    it('should dispatch server action of type user error with error and optional message',
      function() {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: userActionTypes.USER_INVITE_ERROR,
        err,
        contextualMessage: message
      }));
    });
  });

  describe('createdUserAndAssociated', function () {
    let userGuid;
    let orgUsers;
    let orgGuid;
    let expectedParams;
    let spy;
    let user;

    beforeEach(function (done) {
      userGuid = "fake-udid";
      orgGuid = "fake-org-udid";
      user = {
        guid: userGuid,
        username: 'asdf'
      };
      orgUsers = [user, {userGuid: 'wrong-udid'}, {userGuid: 'wrong-udid-2'}];
      expectedParams = {
        userGuid,
        orgGuid,
        user: orgUsers[0]
      };
      spy = setupViewSpy(sandbox);
      userActions.createdUserAndAssociated(userGuid, orgGuid, orgUsers)
        .then(done, done.fail);
    });

    it('should dispatch USER_ORG_ASSOCIATED notice with user and org', function() {
      assertAction(spy, userActionTypes.USER_ORG_ASSOCIATED);
    });
  });

  describe('addUserRoles()', function() {
    it(`should call a view action to add user roles with current roles
        user guid and guid and type`, function() {
      var expectedRole = 'org_manager',
          expectedApiKey = 'managers',
          expectedUserGuid = 'akdfjadzxcvzxcvzxvzx',
          expectedGuid = '2eve2v2vadsfa',
          expectedType = 'org';

      // expectedParams for the params dispatched with userActionTypes.USER_ROLES_ADD.
      // the apiKey is not sent with it.
      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        entityGuid: expectedGuid,
        entityType: expectedType
      };

      let spy = setupViewSpy(sandbox)

      userActions.addUserRoles(
        expectedRole,
        expectedApiKey,
        expectedUserGuid,
        expectedGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_ADD, expectedParams);
    });

    describe('for org user that successfully adds a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let orgGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'putOrgUserPermissions');
        sandbox.stub(userActions, 'addedUserRoles').returns(Promise.resolve());
        roles = ['org_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        orgGuid = 'org-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200
          }).then(function () {
            done();
          });
        });

        userActions.addUserRoles(
          roles,
          apiKey,
          userGuid,
          orgGuid,
          'org'
        ).then(done, done.fail);
      });

      it('should call api for org put user permission with guids and roles', () => {
        expect(cfApi.putOrgUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.putOrgUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          orgGuid,
          apiKey
        ));
      });

      it('should call addedUserRoles action with all information', function() {
        expect(userActions.addedUserRoles).toHaveBeenCalledOnce();
        expect(userActions.addedUserRoles).toHaveBeenCalledWith(sinon.match(
          roles,
          userGuid,
          orgGuid,
          'org'
        ));
      });
    });

    describe('for org user that unsuccessfully adds a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let orgGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'putOrgUserPermissions');
        sandbox.spy(userActions, 'addedUserRoles');
        sandbox.spy(userActions, 'errorChangeUserRole');
        roles = ['org_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        orgGuid = 'org-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 400,
            response: {}
          }).then(function () {
            done();
          });
        });

        userActions.addUserRoles(
          roles,
          apiKey,
          userGuid,
          orgGuid,
          'org'
        ).then(done, done.fail);
      });

      it('should call api for org put user permission with guids and roles', () => {
        expect(cfApi.putOrgUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.putOrgUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          orgGuid,
          apiKey
        ));
      });

      it('should not call addedUserRoles action', () => {
        expect(userActions.addedUserRoles.called).toEqual(false);
      });

      it('should call `errorChangeUserRole`', () => {
        expect(userActions.errorChangeUserRole.called).toEqual(true);
      });
    });

    describe('for space user that successfully adds a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let spaceGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'putSpaceUserPermissions');
        sandbox.stub(userActions, 'addedUserRoles').returns(Promise.resolve());
        roles = ['space_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        spaceGuid = 'space-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200
          }).then(function () {
            done();
          });
        });

        userActions.addUserRoles(
          roles,
          apiKey,
          userGuid,
          spaceGuid,
          'space'
        ).then(done, done.fail);
      });

      it('should call api for space put user permission with guids and roles', () => {
        expect(cfApi.putSpaceUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.putSpaceUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          spaceGuid,
          apiKey
        ));
      });
    });
  });

  describe('for space user that unsuccessfully adds a user permission', function() {
    let roles;
    let apiKey;
    let userGuid;
    let spaceGuid;

    beforeEach(function(done) {
      sandbox.spy(cfApi, 'putSpaceUserPermissions');
      sandbox.spy(userActions, 'addedUserRoles');
      roles = ['space_manager'];
      apiKey = 'managers';
      userGuid = 'user-123';
      spaceGuid = 'space-123';
      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: {}
        }).then(function () {
          done();
        });
      });

      userActions.addUserRoles(
        roles,
        apiKey,
        userGuid,
        spaceGuid,
        'space'
      ).then(done, done.fail);
    });

    it('should not call addedUserRoles action', function() {
      expect(userActions.addedUserRoles.called).toEqual(false);
    });
  });

  describe('addedUserRoles()', function() {
    it(`should call a server action to add user roles with roles user guid and
        resource type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'azxcvoiuzxcvzxcvzxvzx',
          expectedGuid = 'org-guid-asdf',
          expectedType = 'organization';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        entityGuid: expectedGuid,
        entityType: expectedType
      };

      let spy = setupServerSpy(sandbox)

      userActions.addedUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_ADDED, expectedParams);
    });
  });

  describe('deleteUserRoles()', function() {
    it(`should call a view action to remove user roles with current roles
        user guid and org guid and type`, function() {
      var expectedRole = 'org_manager',
          expecctedApiKey = 'managers',
          expectedUserGuid = 'akdfjasdfjasdfadzxcvzxcvzxvzx',
          expectedGuid = '2eve2dsfa',
          expectedType = 'space';

      // expectedParams for the params dispatched with userActionTypes.USER_ROLES_DELETE.
      // the apiKey is not sent with it.
      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        entityGuid: expectedGuid,
        entityType: expectedType
      };

      let spy = setupViewSpy(sandbox)

      userActions.deleteUserRoles(
        expectedRole,
        expecctedApiKey,
        expectedUserGuid,
        expectedGuid,
        expectedType);

      assertAction(spy, userActionTypes.USER_ROLES_DELETE, expectedParams);
    });

    describe('for org user that successfully deletes a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let orgGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'deleteOrgUserPermissions');
        sandbox.spy(userActions, 'errorChangeUserRole');
        sandbox.stub(userActions, 'deletedUserRoles').returns(Promise.resolve());
        roles = ['org_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        orgGuid = 'org-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200
          }).then(function () {
            done();
          });
        });

        userActions.deleteUserRoles(
          roles,
          apiKey,
          userGuid,
          orgGuid,
          'org'
        ).then(done, done.fail);
      });

      it('should call api for org delete user permission with guids and roles', () => {
        expect(cfApi.deleteOrgUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.deleteOrgUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          orgGuid,
          apiKey
        ));
      });

      it('should call deletedUserRoles action with all information', function() {
        expect(userActions.deletedUserRoles).toHaveBeenCalledOnce();
        expect(userActions.deletedUserRoles).toHaveBeenCalledWith(sinon.match(
          roles,
          userGuid,
          orgGuid,
          'org'
        ));
      });

      it('should not call errorChangeUserRole', function() {
        expect(userActions.errorChangeUserRole.called).toEqual(false);
      });
    });

    describe('for org user that unsuccessfully deletes a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let orgGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'deleteOrgUserPermissions');
        sandbox.spy(userActions, 'deletedUserRoles');
        sandbox.spy(userActions, 'errorChangeUserRole');
        roles = ['org_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        orgGuid = 'org-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 400,
            response: {}
          }).then(function () {
            done();
          });
        });

        userActions.deleteUserRoles(
          roles,
          apiKey,
          userGuid,
          orgGuid,
          'org'
        ).then(done, done.fail);
      });

      it('should call api for org delete user permission with guids and roles', () => {
        expect(cfApi.deleteOrgUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.deleteOrgUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          orgGuid,
          apiKey
        ));
      });

      it('should call errorChangeUserRole with the userGuid and the error response', function() {
        expect(userActions.errorChangeUserRole).toHaveBeenCalledOnce();
        expect(userActions.errorChangeUserRole).toHaveBeenCalledWith(sinon.match(
          {}
        ));
      });

      it('should not call deletedUserRoles', function() {
        expect(userActions.deletedUserRoles.called).toEqual(false);
      });
    });

    describe('for space user that successfully deletes a user permission', function() {
      let roles;
      let apiKey;
      let userGuid;
      let spaceGuid;

      beforeEach(function(done) {
        sandbox.spy(cfApi, 'deleteSpaceUserPermissions');
        sandbox.spy(userActions, 'errorChangeUserRole');
        sandbox.stub(userActions, 'deletedUserRoles').returns(Promise.resolve());
        roles = ['space_manager'];
        apiKey = 'managers';
        userGuid = 'user-123';
        spaceGuid = 'space-123';
        moxios.wait(function() {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200
          }).then(function () {
            done();
          });
        });

        userActions.deleteUserRoles(
          roles,
          apiKey,
          userGuid,
          spaceGuid,
          'space'
        ).then(done, done.fail);
      });

      it('should call api for space delete user permission with guids and roles', () => {
        expect(cfApi.deleteSpaceUserPermissions).toHaveBeenCalledOnce();
        expect(cfApi.deleteSpaceUserPermissions).toHaveBeenCalledWith(sinon.match(
          userGuid,
          spaceGuid,
          apiKey
        ));
      });

      it('should call deletedUserRoles action with all information', function() {
        expect(userActions.deletedUserRoles).toHaveBeenCalledOnce();
        expect(userActions.deletedUserRoles).toHaveBeenCalledWith(sinon.match(
          roles,
          userGuid,
          spaceGuid,
          'space'
        ));
      });

      it('should not call errorChangeUserRole', function() {
        expect(userActions.errorChangeUserRole.called).toEqual(false);
      });
    });
  });

  describe('for space user that unsuccessfully deletes a user permission', function() {
    let roles;
    let apiKey;
    let userGuid;
    let spaceGuid;

    beforeEach(function(done) {
      sandbox.spy(cfApi, 'deleteSpaceUserPermissions');
      sandbox.spy(userActions, 'deletedUserRoles');
      sandbox.spy(userActions, 'errorChangeUserRole');
      roles = ['space_manager'];
      apiKey = 'managers';
      userGuid = 'user-123';
      spaceGuid = 'space-123';
      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 400,
          response: {}
        }).then(function () {
          done();
        });
      });

      userActions.deleteUserRoles(
        roles,
        apiKey,
        userGuid,
        spaceGuid,
        'space'
      ).then(done, done.fail);
    });

    it('should call api for space delete user permission with guids and roles', () => {
      expect(cfApi.deleteSpaceUserPermissions).toHaveBeenCalledOnce();
      expect(cfApi.deleteSpaceUserPermissions).toHaveBeenCalledWith(sinon.match(
        userGuid,
        spaceGuid,
        apiKey
      ));
    });

    it('should call errorChangeUserRole action with all information', function() {
      expect(userActions.errorChangeUserRole).toHaveBeenCalledOnce();
      expect(userActions.errorChangeUserRole).toHaveBeenCalledWith(sinon.match(
        {}
      ));
    });

    it('should not call deletedUserRoles', function() {
      expect(userActions.deletedUserRoles.called).toEqual(false);
    });

    it('calls a handleViewAction with the correct type + params', () => {
      const spy = sandbox.spy(AppDispatcher, 'handleViewAction');
      const error = {};
      const message = 'You don\'t have permission to perform that action';
      const expectedParams = { error, message };

      userActions.errorChangeUserRole({});

      assertAction(spy, userActionTypes.USER_ROLE_CHANGE_ERROR, expectedParams);
    });
  });

  describe('deletedUserRoles()', function() {
    it(`should call a server action to add user roles with roles user guid and
        resource type`, function() {
      var expectedRole = 'org_manager',
          expectedUserGuid = 'azxcvoiuzxcvzxcvzxvzx',
          expectedGuid = 'org-asdf',
          expectedType = 'organization';

      let expectedParams = {
        roles: expectedRole,
        userGuid: expectedUserGuid,
        entityGuid: expectedGuid,
        entityType: expectedType
      };

      let spy = setupServerSpy(sandbox)

      userActions.deletedUserRoles(
        expectedRole,
        expectedUserGuid,
        expectedGuid,
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

    it('calls receivedCurrentUser', function () {
      expect(userActions.receivedCurrentUser).toHaveBeenCalledWith({ guid: 'user123' });
    });

  });
});
