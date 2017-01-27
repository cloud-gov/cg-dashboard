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
    describe('.fetchSpaceEvents()', () => {
      let viewSpy, fetchSpaceEventsStub, expectedParams;

      beforeEach(function () {
        let spaceGuid = 'adsfa';
        expectedParams = {
          spaceGuid
        };

        viewSpy = setupViewSpy(sandbox)
        fetchSpaceEventsStub = sandbox.stub(cfApi, 'fetchSpaceEvents').returns(Promise.resolve());

        return activityActions.fetchSpaceEvents(spaceGuid);
      });

      it('should dispatch a EVENTS_FETCH view action', () => {
        assertAction(viewSpy, activityActionTypes.EVENTS_FETCH, expectedParams);
      });

      it('should call cfApi.fetchSpaceEvents', function () {
        expect(fetchSpaceEventsStub).toHaveBeenCalledOnce();
      });
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
    describe('.fetchAppLogs()', () => {
      let viewSpy, fetchAppLogsStub, expectedParams;

      beforeEach(() => {
        const appGuid = 'adsfa';
        expectedParams = {
          appGuid
        };

        viewSpy = setupViewSpy(sandbox)
        fetchAppLogsStub = sandbox.stub(cfApi, 'fetchAppLogs').returns(Promise.resolve());

        return activityActions.fetchAppLogs(appGuid);
      });

      it('should dispatch a LOGS_FETCH view action', () => {
        assertAction(viewSpy, activityActionTypes.LOGS_FETCH, expectedParams);
      });

      it('should call cfApi.fetchAppLogs', function () {
        expect(fetchAppLogsStub).toHaveBeenCalledOnce();
      });
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
