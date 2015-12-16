
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import userActions from '../../../actions/user_actions.js';
import { userActionTypes } from '../../../constants.js';

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
});
