
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupUISpy, setupViewSpy, setupServerSpy } from '../helpers.js';
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

  describe('fetchAll()', function () {
    it('should dispatch a view event of type app all fetch', function() {
      const expectedAppGuid = 'asdflkjzzz1';
      const expectedParams = {
        appGuid: expectedAppGuid
      };

      const spy = setupViewSpy(sandbox);

      appActions.fetchAll(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_ALL_FETCH, expectedParams);
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

  describe('receivedAppAll()', function() {
    it('should dispatch a server event of type app all received', function() {
      const appGuid = 'testingAppGuid';
      const spy = setupServerSpy(sandbox);

      appActions.receivedAppAll(appGuid);

      assertAction(spy, appActionTypes.APP_ALL_RECEIVED, {});
    });
  });

  describe('changeCurrentApp()', function() {
    it('should dispatch a ui event of type app changed with guid', function() {
      const appGuid = 'testingAppGuid';
      const expectedParams = {
        appGuid
      };
      const spy = setupUISpy(sandbox);

      appActions.changeCurrentApp(appGuid);

      assertAction(spy, appActionTypes.APP_CHANGE_CURRENT, {}, expectedParams);
    });
  });

  describe('restart()', function() {
    it('should dispatch a view event of type app restart with guid', function() {
      const appGuid = 'zvmn3hkl';
      const expectedParams = {
        appGuid
      };
      let spy = setupViewSpy(sandbox)

      appActions.restart(appGuid);

      assertAction(spy, appActionTypes.APP_RESTART, expectedParams);
    });
  });

  describe('restarted()', function() {
    it('should dispatch a server event of type app restarted', function() {
      const appGuid = '230894dgvk2r';
      const expectedParams = {
        appGuid
      };
      let spy = setupServerSpy(sandbox)

      appActions.restarted(appGuid);

      assertAction(spy, appActionTypes.APP_RESTARTED, expectedParams);
    });
  });

  describe('error()', function() {
    it('should dispatch server event of type app error', function() {
      const appGuid = '230894dzcxv234';
      const error = { status_code: 123 };
      const expectedParams = {
        appGuid,
        error
      };
      let spy = setupServerSpy(sandbox)

      appActions.error(appGuid, error);

      assertAction(spy, appActionTypes.APP_ERROR, expectedParams);
    });
  });
});
