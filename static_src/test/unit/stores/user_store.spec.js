
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { UserStore as _UserStore } from '../../../stores/user_store.js';
import userActions from '../../../actions/user_actions.js';
import { userActionTypes, errorActionTypes } from '../../../constants';

describe('UserStore', function () {
  let sandbox, UserStore;

  beforeEach(() => {
    UserStore = new _UserStore();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    UserStore.unsubscribe();
    sandbox.restore();
  });

  // TODO purposely not testing get, getAll because they should be in base
  // store.
  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(UserStore.getAll()).toBeEmptyArray();
    });

    it('should set currently viewed type to space', function() {
      expect(UserStore.currentlyViewedType).toEqual('space_users');
    });
  });

  describe('on space users fetch', function() {
    it('should set loading', function() {
      AppDispatcher.handleViewAction({
        type: userActionTypes.SPACE_USER_ROLES_FETCH,
        spaceGuid: 'axckzvjxcov'
      });

      expect(UserStore.loading).toEqual(true);
    });
  });

  describe('on org users fetch', function() {
    it('should fetch org users through the api', function() {
      const expectedGuid = 'axckzvjxcov';

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USERS_FETCH,
        orgGuid: 'axckzvjxcov'
      });

      expect(UserStore.loading).toEqual(true);
    });
  });

  describe('on org user roles fetch', function() {
    it('should set loading to true', function() {
      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USER_ROLES_FETCH,
        orgGuid: 'axckzvjxcov'
      });

      expect(UserStore.loading).toEqual(true);
    });
  });

  describe('disable loading upon all calls completing for org page', function() {
    const expectedGuid = 'axckzvjxcov';
    beforeEach(() => {
      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USER_ROLES_FETCH,
        orgGuid: expectedGuid
      });
      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USERS_FETCH,
        orgGuid: expectedGuid
      });
    });

    it('should see that loading is true.', function() {
      expect(UserStore.loading).toEqual(true);
    });

    it('should see that loading is still true after only org user roles are received', function() {
      AppDispatcher.handleServerAction({
        type: userActionTypes.ORG_USER_ROLES_RECEIVED,
        orgUserRoles: [],
        expectedGuid
      });
      expect(UserStore.loading).toEqual(true);
    });

    it('should see that loading is still true after only org users are received', function() {
      AppDispatcher.handleServerAction({
        type: userActionTypes.ORG_USERS_RECEIVED,
        users: [],
        expectedGuid
      });
      expect(UserStore.loading).toEqual(true);
    });

    it('should see that loading is false after both calls', function() {
      AppDispatcher.handleServerAction({
        type: userActionTypes.ORG_USERS_RECEIVED,
        users: [],
        expectedGuid
      });
      AppDispatcher.handleServerAction({
        type: userActionTypes.ORG_USER_ROLES_RECEIVED,
        orgUserRoles: [],
        expectedGuid
      });
      expect(UserStore.loading).toEqual(false);
    });
  });

  describe('disable loading upon all calls completing for space page', function() {
    const expectedGuid = 'axckzvjxcov';
    beforeEach(() => {
      AppDispatcher.handleViewAction({
        type: userActionTypes.SPACE_USER_ROLES_FETCH,
        spaceGuid: expectedGuid
      });
    });

    it('should see that loading is true.', function() {
      expect(UserStore.loading).toEqual(true);
    });

    it('should see that loading is false after only space users & roles are received', function() {
      AppDispatcher.handleServerAction({
        type: userActionTypes.SPACE_USER_ROLES_RECEIVED,
        users: [],
        expectedGuid
      });
      expect(UserStore.loading).toEqual(false);
    });
  });

  describe('on org users received', function() {
    it('should merge and update new users with existing users in data',
        function() {
    });
  });

  describe('on space user roles received', () => {
    const userGuidA = 'user-a';
    const userGuidB = 'user-b';
    const spaceGuid = 'space-123';
    let expectedUsers;
    let spy;

    beforeEach(() => {
      const spaceUserRoles = [
        {
          guid: userGuidA,
          space_roles: [ 'space_developer' ]
        },
        {
          guid: userGuidB,
          space_roles: [ 'space_developer', 'space_manager' ]
        }
      ]
      const currentUsers = [
        {
          guid: userGuidB,
          space_roles: { [spaceGuid]: ['space_developer'] }
        }
      ];
      expectedUsers = [
        {
          guid: userGuidA,
          space_roles: { [spaceGuid]: ['space_developer'] }
        },
        {
          guid: userGuidB,
          space_roles: { [spaceGuid]: ['space_developer', 'space_manager'] }
        }
      ];

      UserStore._data = Immutable.fromJS(currentUsers);
      spy = sandbox.spy(UserStore, 'emitChange');

      userActions.receivedSpaceUserRoles(spaceUserRoles, spaceGuid);
    });

    afterEach(() => {
      UserStore._data = [];
      spy.restore(UserStore);
    });

    it('should emit a change event', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });

    it('should add any new users', function() {
      expect(UserStore.get(userGuidA)).toEqual(expectedUsers[0]);
    });

    it('should create a roles hash with space guid and all space roles', () => {
      expect(UserStore.get(userGuidA)).toEqual(expectedUsers[0]);
      expect(UserStore.get(userGuidB)).toEqual(expectedUsers[1]);
    });
  });

  describe('on org user roles received', function() {
    beforeEach(function() {
      UserStore._data = Immutable.List();
    });

    it('should emit a change event if data changed', function() {
      const spy = sandbox.spy(UserStore, 'emitChange');

      userActions.receivedOrgUserRoles([{ guid: 'adsfa', organization_roles: [] }],
        'asdf');

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge and update new users with existing users in data', () => {
      const userGuid = 'user-75384';
      const orgGuid = 'org-534789';
      const currentUsers = [
        { guid: userGuid },
        { guid: 'asdf',
          roles: {
            [ orgGuid ]: [ 'org_manager' ] ,
            'adjf': [ 'org_manager' ]
          }
        }
      ];
      const roles = [
        {
          guid: userGuid,
          organization_roles: [ 'org_manager', 'org_auditor' ]
        },
        {
          guid: 'asdf',
          organization_roles: ['org_manager']
        }
      ];
      const expectedUsers = [
        {
          guid: userGuid,
          roles: { [orgGuid]: ['org_manager', 'org_auditor'] }
        },
        {
          guid: 'asdf',
          roles: { 'adjf': ['org_manager'],
                   [orgGuid]: ['org_manager'] }
        }
      ];

      UserStore.push(expectedUsers[0]);
      UserStore.push(expectedUsers[1]);
      userActions.receivedOrgUserRoles(roles, orgGuid);

      expect(UserStore.get(userGuid)).toEqual(expectedUsers[0]);
      expect(UserStore.get('asdf')).toEqual(expectedUsers[1]);
    });
  });

  describe('on org user associated', () => {
    const userGuid = 'user-543';
    const orgGuid = 'org-abc';
    let orgUsers;

    beforeEach(() => {
      const user = {
        guid: userGuid,
        username: 'person@person.com'
      };
      orgUsers = [user, {userGuid: 'wrong-udid'}, {userGuid: 'wrong-udid-2'}];
      sandbox.spy(UserStore, 'emitChange');
      userActions.createdUserAndAssociated(userGuid, orgGuid, orgUsers, 'org_users');
    });

    it('should emit a change', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });

    it('should add the user to the org through an empty role list', function() {
      const actualUser = UserStore.get(userGuid);
      expect(actualUser).toBeDefined();
      expect(actualUser.roles).toBeDefined();
      expect(actualUser.roles[orgGuid]).toBeDefined();
    });
  });

  describe('on org user association received', function() {
    it('should emit a change event if data changed', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');
      const userGuid = "fake-user-guid";
      const entityGuid = "fake-org-guid";
      const entityUsers = [
        {userGuid: userGuid},
        {userGuid: "fake-user-guid-2"},
        {userGuid: "fake-user-guid-3"}
      ];

      userActions.createdUserAndAssociated(userGuid, entityGuid, entityUsers);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge and update org with new users', function() {
      const existingUser = { guid: 'wpqoifesadkzcvn', name: 'Michael' };
      const newUser = { guid: 'dkzcvwpqoifesan' };

      UserStore.push(existingUser);
      expect(UserStore.get('wpqoifesadkzcvn')).toEqual(existingUser);

      AppDispatcher.handleViewAction({
        type: userActionTypes.USER_ORG_ASSOCIATED,
        user: { guid: 'blah' },
        orgGuid: 'adsfa'
      });
      let actual = UserStore.get('wpqoifesadkzcvn');
      let expected = Object.assign({}, existingUser, newUser);
      expect(actual).not.toEqual(expected);
    });
  });

  describe('on user role toggle error', () => {
    it('updates the error and saving properties of the user store', () => {
      const message = 'oh no!';

      AppDispatcher.handleViewAction({
        type: userActionTypes.USER_ROLE_CHANGE_ERROR,
        error: {},
        message
      });

      expect(UserStore.isSaving).toBe(false);
      expect(UserStore.getError()).not.toBe(null);
      expect(UserStore.getError().description).toEqual(message);
    });
  });

  describe('on user roles add', function() {
    it('should call the api for org add if type org to update the role',
        function() {
      var spy = sandbox.stub(cfApi, 'putOrgUserPermissions'),
          expectedRoles = 'org_manager',
          expectedApiKey = 'managers',
          expectedUserGuid = 'zjkxcvadfzxcvz',
          expectedOrgGuid = 'zxcvzcxvzxroiter';

      let testPromise = Promise.resolve()
      spy.returns(testPromise);

      userActions.addUserRoles(
        expectedRoles,
        expectedApiKey,
        expectedUserGuid,
        expectedOrgGuid,
        'organization'
      );

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
      expect(args[2]).toEqual(expectedApiKey);
    });
  });

  describe('on user roles added', function() {
    let user;
    const userGuid = 'user-123';
    const spaceGuid = 'space-123';
    const addedRole = 'space_lord';
    const existingRole = 'space_manager';
    const otherOrgGuid = 'org-123';

    describe('for new role', function() {
      beforeEach(function() {
        const existingUser = {
          guid: userGuid,
          space_roles: {
            [spaceGuid]: [existingRole]
          },
          roles: {
            [otherOrgGuid]: ['org_manager']
          }
        };

        UserStore._data = Immutable.fromJS([existingUser]);
        sandbox.spy(UserStore, 'emitChange'),

        userActions.addedUserRoles(addedRole, userGuid, spaceGuid, 'space');
        user = UserStore.get(userGuid);
      });

      it('should emit a change event', function() {
        expect(UserStore.emitChange).toHaveBeenCalledOnce();
      });

      it('should add the role for that space', function() {
        expect(user.space_roles[spaceGuid]).toContain(addedRole);
      });

      it('should not change any other roles', function() {
        expect(user.space_roles[spaceGuid]).toContain(existingRole);
        expect(user.roles[otherOrgGuid]).toContain('org_manager');
      });
    });

    describe('for a user with no existing space roles, somehow', function() {
      beforeEach(function() {
        const existingUser = {
          guid: userGuid
        }
        UserStore._data = Immutable.fromJS([existingUser]);
        sandbox.spy(UserStore, 'emitChange'),
        userActions.addedUserRoles(addedRole, userGuid, spaceGuid, 'space');
        user = UserStore.get(userGuid);
      });

      it('should emit a change event', function() {
        expect(UserStore.emitChange).toHaveBeenCalledOnce();
      });

      it('should add the role for that org', function() {
        expect(user.space_roles[spaceGuid]).toContain(addedRole);
      });
    });
  });

  describe('on user roles deleted', function() {
    const testGuid = 'zxcvzxc';
    const expectedRole = 'org_dark_lord';
    const otherRole = 'wizard';
    const orgGuid = 'org-123';
    const otherOrgGuid = 'org-987';

    beforeEach(function() {
      const existingUser = {
        guid: testGuid,
        roles: {
          [orgGuid]: [expectedRole, otherRole],
          [otherOrgGuid]: ['org_manager']
        }
      };

      UserStore._data = Immutable.fromJS([existingUser]);
      sandbox.spy(UserStore, 'emitChange'),

      userActions.deletedUserRoles(expectedRole, testGuid, orgGuid, 'org');
    });

    it('should update the resource type roles array if it exists with new roles',
        function() {
      let actual = UserStore.get(testGuid);
      expect(actual).toBeTruthy();
      expect(actual.roles[orgGuid]).not.toContain(expectedRole);
      expect(actual.roles[orgGuid]).toContain(otherRole);
      expect(actual.roles[otherOrgGuid]).toContain('org_manager');
    });

    it('should emit a change event if it finds the user and no role', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('on user delete', function() {
    it('should delete the user on the server', function() {
      var spy = sandbox.spy(cfApi, 'deleteUser'),
          expectedUserGuid = 'znxvmnzvmz',
          expectedOrgGuid = '029fjaskdjfalskdna';
      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
    });
  });

  describe('on user spaces roles remove', function() {
    let spaceGuid;
    beforeEach(() => {
      spaceGuid = 'space-guid';
    });

    it('should remove the user of the guid from the data', function() {
      var expectedUserGuid = 'zxkvnakjdva',
          expectedUser = { guid: expectedUserGuid };

      UserStore._data.push(expectedUser);

      userActions.removeAllSpaceRoles(expectedUserGuid, spaceGuid);

      expect(UserStore.get(expectedUserGuid)).toBeFalsy();
    });
  });

  describe('on user spaces roles removed', function() {
    it('should remove the user of the guid from the data', function() {
      var expectedUserGuid = 'zxkvnakjdva',
          expectedUser = { guid: expectedUserGuid };

      UserStore._data.push(expectedUser);

      userActions.handleSpaceRolesRemoved(['random-response'], expectedUserGuid);

      expect(UserStore.get(expectedUserGuid)).toBeFalsy();
    });

    it('should emit a change event if it deletes something', function() {
      var spy = sandbox.spy(UserStore, 'emitChange'),
          testUserGuid = 'qpweoiralkfdsj';

      UserStore._data = Immutable.fromJS([{guid: testUserGuid}]);
      userActions.handleSpaceRolesRemoved(['random-response'], testUserGuid);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change event if nothing deleted', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      userActions.handleSpaceRolesRemoved(['random-response'], 'asdfljk');

      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('on user deleted', function() {
    it('should remove the user of the guid from the data', function() {
      var expectedUserGuid = 'zxkvnakjdva',
          expectedUser = { guid: expectedUserGuid };

      UserStore._data.push(expectedUser);

      userActions.deletedUser(expectedUserGuid, 'alkdfj');

      expect(UserStore.get(expectedUserGuid)).toBeFalsy();
    });

    it('should emit a change event if it deletes something', function() {
      var spy = sandbox.spy(UserStore, 'emitChange'),
          testUserGuid = 'qpweoiralkfdsj';

      UserStore._data = Immutable.fromJS([{guid: testUserGuid}]);
      userActions.deletedUser(testUserGuid, 'testOrgGuid');

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change event if nothing deleted', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      userActions.deletedUser('asdfljk', 'adlsvjkadfa');

      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('on error remove user', function() {
    it('should emit a change event', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      userActions.errorRemoveUser('asdf', {});

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set the error to the error passed in', function() {
      var expected = { code: 10007, message: 'test' };

      userActions.errorRemoveUser('asdf', expected);

      expect(UserStore.getError()).toEqual(expected);
    });
  });

  describe('on user change viewed type', function() {
    it('should emit a change event if it changed', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      UserStore._currentViewedType = 'org';

      userActions.changeCurrentlyViewedType('space');

      userActions.changeCurrentlyViewedType('space');

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should change currentlyViewedType to whatever is passed in', function() {
      UserStore._currentViewedType = 'org';

      userActions.changeCurrentlyViewedType('space');

      expect(UserStore.currentlyViewedType).toEqual('space');
    });
  });

  describe('on current user info received', function () {
    it('should emit a change event always', function () {
      const userGuid = 'zxsdkfjasdfladsf';
      const user = { user_id: userGuid, user_name: 'mr' };
      const existingUser = { guid: userGuid };
      const spy = sandbox.spy(UserStore, 'emitChange');

      UserStore._data = Immutable.fromJS([existingUser]);
      AppDispatcher.handleServerAction({
        type: userActionTypes.CURRENT_USER_INFO_RECEIVED,
        currentUser: user
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge the currentUser', function () {
      const userGuid = 'zxsdkfjasdfladsf';
      const currentUserInfo = { user_id: userGuid, user_name: 'mr' };
      const existingUser = { guid: userGuid };
      UserStore._data = Immutable.fromJS([existingUser]);

      AppDispatcher.handleServerAction({
        type: userActionTypes.CURRENT_USER_INFO_RECEIVED,
        currentUser: currentUserInfo
      });

      const actual = UserStore.currentUser;
      expect(actual).toEqual({ ...currentUserInfo, ...existingUser });
    });
  });

  describe('on CURRENT_UAA_INFO_RECEIVED', function () {
    let userGuid, existingUser, spy, currentUaaInfo;

    beforeEach(() => {
      userGuid = 'zxsdkfjasdfladsf';
      existingUser = { guid: userGuid };
      spy = sandbox.spy(UserStore, 'emitChange');
      UserStore._data = Immutable.fromJS([existingUser]);
    });

    it('should not fail when groups is missing in uaaInfo', function () {
      currentUaaInfo = { guid: '1234' };
      const uaaInfo = {groups: []};

      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_UAA_INFO_RECEIVED,
        currentUaaInfo
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should emit a change event always', function () {
      currentUaaInfo = { groups: [{}], guid: '1234' };

      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_UAA_INFO_RECEIVED,
        currentUaaInfo
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should test when UAA group for is not admin', function () {
      currentUaaInfo = { groups: [{}], guid: '1234' };

      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_UAA_INFO_RECEIVED,
        currentUaaInfo
      });

      const actual = UserStore;
      expect(spy).toHaveBeenCalledOnce();
      expect(actual._currentUserIsAdmin).toEqual(false);
    });

    it('should test when UAA group for admin is there', function () {
      currentUaaInfo = { groups: [{display: 'cloud_controller.admin'}], guid: '1234' };

      UserStore._data = Immutable.fromJS([existingUser]);
      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_UAA_INFO_RECEIVED,
        currentUaaInfo
      });

      const actual = UserStore;
      expect(spy).toHaveBeenCalledOnce();
      expect(actual._currentUserIsAdmin).toEqual(true);
    });
  });

  describe('getAllInSpace()', function() {
    // TODO possibly move this functionality to shared place.
    it('should find all user that have the space guid passed in', function() {
      var spaceGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', space_roles: { [spaceGuid]: [ 'space_user'] } };

      UserStore.push(testUser);

      let actual = UserStore.getAllInSpace(spaceGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });

  describe('getAllInOrg()', function() {
    it('should find all users that have the org guid passed in', function() {
      var orgGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', roles: { [orgGuid]: ['org_user'] } };

      UserStore.push(testUser);

      let actual = UserStore.getAllInOrg(orgGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });

  describe('getAllInOrgAndNotSpace()', function() {
    it('should find all users that are in an org and not in the space', function() {
      var spaceGuid = 'sdfadf';
      var orgGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', roles: { [orgGuid]: [ 'org_user'] } };

      UserStore.push(testUser);

      let actual = UserStore.getAllInOrgAndNotSpace(spaceGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });

  describe('USER_FETCH', function () {
    let user;
    beforeEach(function () {
      AppDispatcher.handleViewAction({
        type: userActionTypes.USER_FETCH,
        userGuid: '123'
      });

      user = UserStore.get('123');
    });

    it('sets user state to fetching', function () {
      expect(user.fetching).toBe(true);
    });
  });

  describe('USER_RECEIVED', function () {
    let user;
    beforeEach(function () {
      AppDispatcher.handleViewAction({
        type: userActionTypes.USER_RECEIVED,
        user: { guid: '123' }
      });

      user = UserStore.get('123');
    });

    it('sets user state to non-fetching', function () {
      expect(user.fetching).toBe(false);
    });
  });

  describe('CURRENT_USER_FETCH', function () {
    beforeEach(function () {
      sandbox.spy(UserStore, 'emitChange');
      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_USER_FETCH
      });
    });

    it('sets loading state true', function () {
      expect(UserStore.isLoadingCurrentUser).toBe(true);
    });

    it('sets loading currentUser state true', function () {
      expect(UserStore._loading.currentUser).toBe(true);
    });

    it('emits change', function () {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('CURRENT_USER_RECEIVED', function () {
    beforeEach(function () {
      const currentUser = { guid: '1234' };
      sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.CURRENT_USER_RECEIVED,
        currentUser
      });
    });

    it('sets loading state false', function () {
      expect(UserStore.isLoadingCurrentUser).toBe(false);
    });

    it('sets loading currentUser state false', function () {
      expect(UserStore._loading.currentUser).toBe(false);
    });

    it('emits change', function () {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('on USER_LIST_NOTICE_CREATED', function() {
    let notice;

    beforeEach(function() {
      notice = { noticeType: "finish", description: "An email invite was sent to undefined. Their account has been associated to this space, and their space roles can be controlled below." };
      UserStore._userListNotification = notice;
      sandbox.spy(UserStore, 'emitChange');

      userActions.createInviteNotification();
    });

    it('should create notification for user invite', function() {
      expect(UserStore.getUserListNotification()).toBeDefined();
      expect(UserStore.getUserListNotification().description).toEqual(notice.description);
      expect(UserStore.getUserListNotification().noticeType).toEqual(notice.noticeType);
    });

    it('should emit a change event', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('on USER_LIST_NOTICE_DISMISSED', function() {
    let notice;

    beforeEach(function() {
      notice = { noticeType: "finish", description: "message" };
      UserStore._userListNotification = notice;
      sandbox.spy(UserStore, 'emitChange');

      userActions.createUserListNotification();
    });

    it('should clear notification for user invite', function() {
      expect(UserStore.getUserListNotification()).toBeDefined();
      expect(UserStore.getUserListNotification().description).not.toEqual(notice.description);
      expect(UserStore.getUserListNotification().noticeType).not.toEqual(notice.noticeType);
    });

    it('should emit a change event', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('on USER_INVITE_ERROR', function() {
    let error;
    let message;

    beforeEach(function() {
      UserStore._userListNotificationError = null;
      message = 'Inviting user did not work';
      error = { status: 500, message: 'CF said this' };
      sandbox.spy(UserStore, 'emitChange');

      userActions.userListNoticeError(error, message);
    });

    it('should add a error message to the user invite error field', function() {
      expect(UserStore.getUserListNotificationError()).toBeDefined();
      expect(UserStore.getUserListNotificationError().contextualMessage).toEqual(message);
      expect(UserStore.getUserListNotificationError().message).toEqual(error.message);
    });

    it('should emit a change event', function() {
      expect(UserStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe('getUserListNotification()', function () {
    describe('user with _userListNotification', function () {
      let user, space, org, actual, notice;

      beforeEach(function () {
        notice = { noticeType: 'finish', description: 'a message' };
        org = { guid: 'org1234' };
        space = { guid: 'space1234' };
        user = {
          guid: 'user123',
          roles: {
            [space.guid]: ['space_developer'],
            [org.guid]: ['org_manager', 'org_auditor']
          }
        };

        UserStore.push(user);
      });

      it('returns notice when _userListNotification has content', function () {
        UserStore._userListNotification = notice;
        actual = UserStore.getUserListNotification()
        expect(actual).toBe(notice);
      });

    });
  });

  describe('on CLEAR', () => {
    beforeEach(function() {
      const notice = { noticeType: "finish", description: "message" };
      UserStore._userListNotification = notice;
      UserStore._error = 'something';
      UserStore._saving = true;
      UserStore._userListNotificationError = 'invite error';
      UserStore._loading = {currentUser: true};
      sandbox.spy(UserStore, 'emitChange');
      AppDispatcher.handleViewAction({
        type: errorActionTypes.CLEAR,
      });

    });
    it('resets all of the notifications and errors', () => {
      expect(UserStore._userListNotification).toEqual({});
      expect(UserStore._error).toBe(null);
      expect(UserStore._saving).toEqual(false);
      expect(UserStore._userListNotificationError).toBe(null);
      expect(UserStore._loading).toEqual({});
    });
  });

  describe('currentlyViewedType()', function () {
    describe('user with _currentViewedType', function () {
      let user, space, org, actual;

      beforeEach(function () {
        org = { guid: 'org1234' };
        space = { guid: 'space1234' };
        user = {
          guid: 'user123',
          roles: {
            [space.guid]: ['space_developer'],
            [org.guid]: ['org_manager', 'org_auditor']
          }
        };

        UserStore.push(user);
      });

      it('returns space for _currentViewedType equals space_user', function () {
        UserStore._currentViewedType = 'space_user';
        actual = UserStore.currentlyViewedType
        expect(actual).toBe('space_user');
      });

      it('returns org for _currentViewedType equals org_user', function () {
        UserStore._currentViewedType = 'org_user';
        actual = UserStore.currentlyViewedType
        expect(actual).toBe('org_user');
      });
    });
  });

  describe('isAdmin()', function () {
    describe('user with _currentUserIsAdmin', function () {
      let user, space, org, actual;

      beforeEach(function () {
        org = { guid: 'org1234' };
        space = { guid: 'space1234' };
        user = {
          guid: 'user123',
          roles: {
            [space.guid]: ['space_developer'],
            [org.guid]: ['org_manager', 'org_auditor']
          }
        };

        UserStore.push(user);
      });

      it('returns true for _currentUserIsAdmin equals true', function () {
        UserStore._currentUserIsAdmin = true;
        actual = UserStore.isAdmin()
        expect(actual).toBe(true);
      });

      it('returns true for _currentUserIsAdmin equals false', function () {
        UserStore._currentUserIsAdmin = false;
        actual = UserStore.isAdmin()
        expect(actual).toBe(false);
      });
    });
  });

  describe('hasRole()', function () {
    describe('user with space_developer and org roles', function () {
      let user, space, org, isAdmin;

      beforeEach(function () {
        org = { guid: 'org1234' };
        space = { guid: 'space1234' };
        user = {
          guid: 'user123',
          roles: {
            [space.guid]: ['space_developer'],
            [org.guid]: ['org_manager', 'org_auditor']
          }
        };

        UserStore.push(user);
      });

      it('returns true for space_developer', function () {
        expect(UserStore.hasRole(user.guid, space.guid, 'space_developer')).toBe(true);
      });

      it('returns false for space_manager', function () {
        expect(UserStore.hasRole(user.guid, space.guid, 'space_manager')).toBe(false);
      });

      it('returns true for org_manager', function() {
        expect(UserStore.hasRole(user.guid, org.guid, 'org_manager')).toBe(true);
      });

      it('returns true for org_manager and org_auditor', function() {
        expect(UserStore.hasRole(user.guid, org.guid, ['org_manager', 'org_auditor'])).toBe(true);
      });

      it('returns true for org_manager and org_developer', function() {
        expect(UserStore.hasRole(user.guid, org.guid, ['org_manager', 'org_developer'])).toBe(true);
      });

      it('returns true for space_developer as uaa admin', function () {
        UserStore._currentUserIsAdmin = true;
        expect(UserStore.hasRole(user.guid, space.guid, 'space_developer')).toBe(true);
      });

      it('returns false for space_manager as uaa admin', function () {
        UserStore._currentUserIsAdmin = true;
        expect(UserStore.hasRole(user.guid, space.guid, 'space_manager')).toBe(true);
      });

      it('returns true for org_manager as uaa admin', function() {
        UserStore._currentUserIsAdmin = true;
        expect(UserStore.hasRole(user.guid, org.guid, 'org_manager')).toBe(true);
      });

      it('returns true for org_manager and org_auditor as uaa admin', function() {
        UserStore._currentUserIsAdmin = true;
        expect(UserStore.hasRole(user.guid, org.guid, ['org_manager', 'org_auditor'])).toBe(true);
      });

      it('returns true for org_manager and org_developer as uaa admin', function() {
        UserStore._currentUserIsAdmin = true;
        expect(UserStore.hasRole(user.guid, org.guid, ['org_manager', 'org_developer'])).toBe(true);
      });

      it('returns false for another space', function () {
        expect(UserStore.hasRole(user.guid, 'otherspace123', 'space_developer')).toBe(false);
      });

      it('returns false for another user', function () {
        expect(UserStore.hasRole('otheruser123', space.guid, 'space_developer')).toBe(false);
      });
    });
  });
});
