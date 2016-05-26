
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import UserStore from '../../../stores/user_store.js';
import userActions from '../../../actions/user_actions.js';
import { userActionTypes } from '../../../constants';

describe('UserStore', function() {
  var sandbox;

  beforeEach(() => {
    UserStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // TODO purposely not testing get, getAll because they should be in base
  // store.
  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(UserStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on space users fetch', function() {
    it('should fetch space users through api', function() {
      var spy = sandbox.spy(cfApi, 'fetchSpaceUsers'),
          expectedGuid = 'axckzvjxcov';

      AppDispatcher.handleViewAction({
        type: userActionTypes.SPACE_USERS_FETCH,
        spaceGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on org users fetch', function() {
    it('should fetch org users through the api', function() {
      var spy = sandbox.spy(cfApi, 'fetchOrgUsers'),
          expectedGuid = 'axckzvjxcov';

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USERS_FETCH,
        orgGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on org user roles fetch', function() {
    it('should fetch org user roles through api', function() {
      var spy = sandbox.spy(cfApi, 'fetchOrgUserRoles'),
          expectedGuid = 'axckzvjxcov';

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USER_ROLES_FETCH,
        orgGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on space or org users received', function() {
    it('should emit a change event if data was updated', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.SPACE_USERS_RECEIVED,
        users: wrapInRes([{ guid: 'adsfa' }])
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change if no users was passed in', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USERS_RECEIVED,
        users: []
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should merge and update new users with existing users in data',
        function() {
      var sharedGuid = 'wpqoifesadkzcvn';

      let existingUser = { guid: sharedGuid, name: 'Michael' };
      let newUser = { guid: sharedGuid, email: 'michael@gsa.gov' };

      UserStore.push(existingUser);
      expect(UserStore.get(sharedGuid)).toEqual(existingUser);

      AppDispatcher.handleServerAction({
        type: userActionTypes.SPACE_USERS_RECEIVED,
        users: wrapInRes([newUser])
      });

      let actual = UserStore.get(sharedGuid);
      expect(actual).toEqual({
        guid: sharedGuid,
        name: 'Michael',
        email: 'michael@gsa.gov'
      });
    });

    it('should add org and/or space guid to user', function() {
      var user = { guid: 'adzxcv', name: 'Seymor' },
          expectedGuid = 'a09dsfuva';

      AppDispatcher.handleServerAction({
        type: userActionTypes.SPACE_USERS_RECEIVED,
        users: wrapInRes([user]),
        orgGuid: expectedGuid
      });

      let actual = UserStore.get(user.guid);

      expect(actual.orgGuid).toEqual(expectedGuid);
    });
  });

  describe('on org user roles received', function() {
    it('should emit a change event if data changed', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USER_ROLES_RECEIVED,
        orgUserRoles: wrapInRes([{ guid: 'adsfa' }])
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge and update new users with existing users in data',
        function() {
      const sharedGuid = 'wpqoifesadkzcvn';
      const existingUser = { guid: sharedGuid, name: 'Michael' };
      const newUser = { guid: sharedGuid, organization_roles: ['role'] };

      UserStore.push(existingUser);
      expect(UserStore.get(sharedGuid)).toEqual(existingUser);

      console.log('yo', wrapInRes([newUser]));

      AppDispatcher.handleViewAction({
        type: userActionTypes.ORG_USER_ROLES_RECEIVED,
        orgUserRoles: wrapInRes([newUser])
      });
      let actual = UserStore.get(sharedGuid);
      let expected = Object.assign({}, existingUser, newUser);
      expect(actual).toEqual(expected);
    });
  });

  describe('on user roles add', function() {
    it('should call the api for org add if type org to update the role',
        function() {
      var spy = sandbox.stub(cfApi, 'putOrgUserPermissions'),
          expectedRoles = 'org_manager',
          expectedUserGuid = 'zjkxcvadfzxcvz',
          expectedOrgGuid = 'zxcvzcxvzxroiter';

      let testPromise = Promise.resolve()
      spy.returns(testPromise);

      userActions.addUserRoles(
        expectedRoles,
        expectedUserGuid,
        expectedOrgGuid,
        'organization'
      );

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
      expect(args[2]).toEqual(expectedRoles);
    });

    it('should call the added user role action with role, user guid and type',
        function() {

    });
  });

  describe('on user roles added', function() {
    it('should update the resource type roles array if it exists with new roles',
        function() {
      var testGuid = 'zxcvzxc',
          expectedRole = 'org_dark_lord';

      var existingUser = {
        guid: testGuid,
        organization_roles: ['org_manager']
      };

      UserStore.push(existingUser);

      userActions.addedUserRoles(expectedRole, testGuid, 'organization');

      let actual = UserStore.get(testGuid);
      expect(actual).toBeTruthy();
      expect(actual.organization_roles).toContain(expectedRole);
    });

    it('should emit a change event if it finds the user', function() {
      const spy = sandbox.spy(UserStore, 'emitChange');
      const testUserGuid = '234xcvbqwn';
      const initialData = [{guid: testUserGuid, organization_roles: []}]

      UserStore._data = Immutable.fromJS(initialData);
      userActions.addedUserRoles('testrole', testUserGuid, 'organization');

      expect(spy).toHaveBeenCalledOnce();
    });

    it(`should map certain resource names to a role name when adding to user`,
        function() {

    });
  });

  describe('on user roles delete', function() {
    it('should call the api to delete the role', function() {
      var spy = sandbox.stub(cfApi, 'deleteOrgUserPermissions'),
          expectedRoles = 'org_manager',
          expectedUserGuid = 'zjkxcvz234asdf',
          expectedOrgGuid = 'zxcvzcxvzxroiter';

      let testPromise = Promise.resolve()
      spy.returns(testPromise);

      userActions.deleteUserRoles(
        expectedRoles,
        expectedUserGuid,
        expectedOrgGuid,
        'organization'
      );

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
      expect(args[2]).toEqual(expectedRoles);
    });

    it('should call the deleted user role action with role, user guid and type',
        function() {

    });
  });

  describe('on user roles deleted', function() {
    it('should update the resource type roles array if it exists with new roles',
        function() {
      var testGuid = 'zxcvzxc',
          expectedRole = 'org_dark_lord';

      var existingUser = {
        guid: testGuid,
        organization_roles: ['org_manager', expectedRole]
      };

      UserStore._data = Immutable.fromJS([existingUser]);

      userActions.deletedUserRoles(expectedRole, testGuid, 'organization');

      let actual = UserStore.get(testGuid);
      expect(actual).toBeTruthy();
      expect(actual.organization_roles).not.toContain(expectedRole);
    });

    it('should emit a change event if it finds the user and no role', function() {
      var spy = sandbox.spy(UserStore, 'emitChange'),
          expectedRole = 'org_dark_lord',
          testUserGuid = '234xcvbqwn';

      UserStore._data = Immutable.fromJS([{
        guid: testUserGuid,
        organization_roles: [expectedRole]
      }]);
      userActions.deletedUserRoles(expectedRole, testUserGuid, 'organization');

      expect(spy).toHaveBeenCalledOnce();
    });

    it(`should map certain resource names to a role name when deleting from user`,
        function() {

    });
  });

  describe('on user delete', function() {
    it('should remove user permissions from org', function() {
      var spy = sandbox.spy(cfApi, 'deleteOrgUserPermissions'),
          expectedUserGuid = '19p83fhasjkdhf',
          expectedOrgGuid = 'zxncmvduhvad',
          expectedCategory = 'users';

      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
      expect(args[2]).toEqual(expectedCategory);
    });

    it('should delete the user on the server', function() {
      var spy = sandbox.spy(cfApi, 'deleteUser'),
          stub = sandbox.stub(cfApi, 'deleteOrgUserPermissions'),
          expectedUserGuid = 'znxvmnzvmz',
          expectedOrgGuid = '029fjaskdjfalskdna';

      let testPromise = {
        then: function(cb) {
          cb();
        }
      }

      stub.returns(testPromise);

      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
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

  describe('getAllInSpace()', function() {
    // TODO possibly move this functionality to shared place.
    it('should find all user that have the space guid passed in', function() {
      var spaceGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', spaceGuid: spaceGuid };

      UserStore.push(testUser);

      let actual = UserStore.getAllInSpace(spaceGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });

  describe('getAllInOrg()', function() {
    it('should find all users that have the org guid passed in', function() {
      var orgGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', orgGuid: orgGuid };

      UserStore.push(testUser);

      let actual = UserStore.getAllInOrg(orgGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });
});
