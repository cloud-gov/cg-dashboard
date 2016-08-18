import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupUISpy, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import activityActions from '../../../actions/activity_actions.js';
import { activityActionTypes } from '../../../constants.js';

describe('activityActions', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('space events', () => {
    it('should dispatch a EVENTS_FETCH view action', () => {
      var spaceGuid = 'adsfa',
          expectedParams = {
            spaceGuid
          };

      let spy = setupViewSpy(sandbox)

      activityActions.fetchSpaceEvents(spaceGuid);

      assertAction(spy, activityActionTypes.EVENTS_FETCH, expectedParams);
    });

    it('should dispatch a EVENTS_RECEIVED server action', () => {
      var events = ['event-one', 'event-two', 'event-three'],
          expectedParams = {
            events
          };

      let spy = setupServerSpy(sandbox)

      activityActions.receivedSpaceEvents(events);
      assertAction(spy, activityActionTypes.EVENTS_RECEIVED, expectedParams);
    });
  });

  describe('app logs', () => {
    it('should dispatch a LOGS_FETCH view action', () => {
      var appGuid = 'adsfa',
          expectedParams = {
            appGuid
          };

      let spy = setupViewSpy(sandbox)

      activityActions.fetchAppLogs(appGuid);

      assertAction(spy, activityActionTypes.LOGS_FETCH, expectedParams);
    });

    it('should dispatch a LOGS_RECEIVED server action', () => {
      var appGuid = 'app-one',
          logs = ['logs-one', 'logs-two', 'logs-three'],
          expectedParams = {
            appGuid,
            logs
          };

      let spy = setupServerSpy(sandbox)

      activityActions.receivedAppLogs(appGuid, logs);
      let actionInfo = spy.getCall(0).args[0];
      assertAction(spy, activityActionTypes.LOGS_RECEIVED, expectedParams);
    });
  });
});
