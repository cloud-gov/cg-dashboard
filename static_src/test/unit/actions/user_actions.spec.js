
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
});
