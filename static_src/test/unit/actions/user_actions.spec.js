
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
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
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedOrgGuid = 'asdflkjz';

      userActions.fetchOrgUsers(expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.ORG_USERS_FETCH);
      expect(arg.orgGuid).toEqual(expectedOrgGuid);
    });
  });

  describe('fetchSpaceUsers()', function() {
    it('should dispatch a view event of type space users fetch', function() {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedSpaceGuid = 'asdflkjz';

      userActions.fetchSpaceUsers(expectedSpaceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.SPACE_USERS_FETCH);
      expect(arg.spaceGuid).toEqual(expectedSpaceGuid);
    });
  });

  describe('receivedOrgUsers()', function() {
    it(`should dispatch a server event of type org users received with received
        data`, function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expected = [{ entity: { }, metadata: { guid: 'adf' }}];
      
      userActions.receivedOrgUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.ORG_USERS_RECEIVED);
      expect(arg.users).toEqual(expected);
    });
  });

  describe('receivedSpaceUsers()', function() {
    it(`should dispatch a server event of type space users received with received
        data`, function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expected = [{ entity: { }, metadata: { guid: 'adf' }}];
      
      userActions.receivedSpaceUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.SPACE_USERS_RECEIVED);
      expect(arg.users).toEqual(expected);
    });
  });

  describe('deleteUser()', function() {
    it('should dispatch a view event of type user delete with user guid',
        function() {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedUserGuid = 'adsklfjanmxcv',
          expectedOrgGuid = 'sdkjfcmxxzcxvzz';
          
      userActions.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.USER_DELETE);
      expect(arg.userGuid).toEqual(expectedUserGuid);
      expect(arg.orgGuid).toEqual(expectedOrgGuid);
    })
  });

  describe('deletedUser()', function() {
    it('should dispatch a server event of type user deleted with user guid',
        function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expectedUserGuid = 'klfjanmxcvasfzcv',
          expectedOrgGuid = '0909uasdifhnmzxcv';
          
      userActions.deletedUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.USER_DELETED);
      expect(arg.userGuid).toEqual(expectedUserGuid);
      expect(arg.orgGuid).toEqual(expectedOrgGuid);
    })
  });

  describe('errorRemoveUser()', function() {
    it('should call a server action for remove error', function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expectedUserGuid = 'klfjanmxcvasfzcv',
          expectedError = { code: 10006, message: 'something bad' };
          
      userActions.errorRemoveUser(expectedUserGuid, expectedError);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(userActionTypes.ERROR_REMOVE_USER);
      expect(arg.userGuid).toEqual(expectedUserGuid);
      expect(arg.error).toEqual(expectedError);
    });
  });
});
