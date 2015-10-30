
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import UserStore from '../../../stores/user_store.js';
import userActions from '../../../actions/user_actions.js';
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
      let newUser = { guid: sharedGuid, email: 'michale@gsa.gov' };

      UserStore._data.push(existingUser);
      expect(UserStore.get(sharedGuid)).toEqual(existingUser);

      AppDispatcher.handleServerAction({
        type: userActionTypes.SPACE_USERS_RECEIVED,
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

  describe('on user delete', function() {
    it('should remove user categories from org', function() {
      var spy = sandbox.spy(cfApi, 'deleteOrgUserCategory'),
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
          stub = sandbox.stub(cfApi, 'deleteOrgUserCategory'),
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

      UserStore._data.push({guid: testUserGuid});
      userActions.deletedUser(testUserGuid, 'adlsvjkadfa');

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change event if nothing deleted', function() {
      var spy = sandbox.spy(UserStore, 'emitChange');

      userActions.deletedUser('asdfljk', 'adlsvjkadfa');

      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('getAllInSpace()', function() {
    // TODO possibly move this functionality to shared place.
    it('should find all user that have the space guid passed in', function() {
      var spaceGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', spaceGuid: spaceGuid };

      UserStore._data.push(testUser);

      let actual = UserStore.getAllInSpace(spaceGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });

  describe('getAllInOrg()', function() {
    it('should find all users that have the org guid passed in', function() {
      var orgGuid = 'asdfa';
      var testUser = { guid: 'adfzxcv', orgGuid: orgGuid };

      UserStore._data.push(testUser);

      let actual = UserStore.getAllInOrg(orgGuid);

      expect(actual[0]).toEqual(testUser);
    });
  });
});
