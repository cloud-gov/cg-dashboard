
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import UserStore from '../../../stores/user_store.js';
import { userActionTypes } from '../../../constants';

describe('UserStore', function() {
  var sandbox;

  beforeEach(() => {
    UserStore._data = [];
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

  describe('on space users received', function() {
    it('should emit a change event if data was updated', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.USERS_RECEIVED,
        users: wrapInRes([{ guid: 'adsfa' }])
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('shoudl not emit a change if no users was passed in', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: userActionTypes.USERS_RECEIVED,
        users: []
      });

      expect(spy).not.toHaveBeenCalled();
    });
    
    it('should merge and update new users with existing users in data',
        function() {
      var sharedGuid = 'wpqoifesadkzcvn';

      let existingUser = { guid: sharedGuid, name: 'Michael' };
      let newUser = { guid: sharedGuid, email: 'michale@gsa.gov' };

      UserStore._data.push(existingUser);
      expect(UserStore.get(sharedGuid)).toEqual(existingUser);

      AppDispatcher.handleServerAction({
        type: userActionTypes.USERS_RECEIVED,
        users: wrapInRes([newUser])
      });

      let actual = UserStore.get(sharedGuid);
      expect(actual).toEqual(
        { guid: sharedGuid,
          name: 'Michael',
          email: 'michale@gsa.gov'
        }
      );
    });
  });
});
