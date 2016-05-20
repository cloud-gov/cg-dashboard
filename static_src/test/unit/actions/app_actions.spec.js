
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import appActions from '../../../actions/app_actions.js';
import { appActionTypes } from '../../../constants.js';

describe('appActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetch()', function() {
    it('should dispatch a view event of type app fetch', function() {
      var expectedAppGuid = 'asdflkjz',
          expectedParams = {
            appGuid: expectedAppGuid
          };

      let spy = setupViewSpy(sandbox)

      appActions.fetch(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_FETCH,
                   expectedParams)
    });
  });

  describe('fetchStats()', function() {
    it('should dispatch a view event of type app stats fetch', function() {
      var expectedAppGuid = 'asdflkjzzz1',
          expectedParams = {
            appGuid: expectedAppGuid
          };

      let spy = setupViewSpy(sandbox)

      appActions.fetchStats(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_STATS_FETCH,
                   expectedParams)
    });
  });

  describe('receivedApp()', function() {
    it('should dispatch a server event of type app resv with app data',
        function() {
      var expected = { guid: 'asdfa', service: [] },
          expectedParams = {
            app: expected
          };

      let spy = setupServerSpy(sandbox)

      appActions.receivedApp(expected);

      assertAction(spy, appActionTypes.APP_RECEIVED,
                   expectedParams)
    });
  });

  describe('receivedAppStats()', function() {
    it('should dispatch a server event of type app stat resv with app data',
        function() {
      var expected = { guid: 'asdfazzzb', service: [] },
          expectedParams = {
            appGuid: expected.guid,
            app: expected
          };

      let spy = setupServerSpy(sandbox);

      appActions.receivedAppStats(expected.guid, expected);

      assertAction(spy, appActionTypes.APP_STATS_RECEIVED,
                   expectedParams)
    });
  });
});
