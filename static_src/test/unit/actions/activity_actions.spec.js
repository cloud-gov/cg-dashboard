import '../../global_setup.js';

import { assertAction, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import activityActions from '../../../actions/activity_actions.js';
import { activityActionTypes } from '../../../constants.js';

describe('activityActions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('space events', () => {
    describe('.fetchSpaceEvents()', () => {
      let viewSpy, fetchSpaceEventsStub, expectedParams, expectedEvents, receivedSpaceEventsStub;

      beforeEach(function (done) {
        const spaceGuid = 'adsfa';
        expectedParams = {
          spaceGuid
        };

        expectedEvents = [];

        viewSpy = setupViewSpy(sandbox);
        fetchSpaceEventsStub = sandbox.stub(cfApi, 'fetchSpaceEvents')
          .returns(Promise.resolve(expectedEvents));
        receivedSpaceEventsStub = sandbox.stub(activityActions, 'receivedSpaceEvents')
          .returns(Promise.resolve());

        activityActions.fetchSpaceEvents(spaceGuid)
          .then(done, done.fail);
      });

      it('should dispatch a EVENTS_FETCH view action', () => {
        assertAction(viewSpy, activityActionTypes.EVENTS_FETCH, expectedParams);
      });

      it('should call cfApi.fetchSpaceEvents', function () {
        expect(fetchSpaceEventsStub).toHaveBeenCalledOnce();
      });

      it('should call receivedSpaceEvents', function () {
        expect(receivedSpaceEventsStub).toHaveBeenCalledWith(expectedEvents);
      });
    });

    it('should dispatch a EVENTS_RECEIVED server action', () => {
      const events = ['event-one', 'event-two', 'event-three'],
        expectedParams = {
          events
        };

      const spy = setupServerSpy(sandbox);

      activityActions.receivedSpaceEvents(events);
      assertAction(spy, activityActionTypes.EVENTS_RECEIVED, expectedParams);
    });
  });

  describe('app logs', () => {
    describe('.fetchAppLogs()', () => {
      let appGuid, viewSpy, fetchAppLogsStub, receivedAppLogsStub, expectedParams, expectedLogs;

      beforeEach((done) => {
        appGuid = 'adsfa';
        expectedParams = {
          appGuid
        };
        expectedLogs = [];

        viewSpy = setupViewSpy(sandbox);
        fetchAppLogsStub = sandbox.stub(cfApi, 'fetchAppLogs')
          .returns(Promise.resolve(expectedLogs));
        receivedAppLogsStub = sandbox.stub(activityActions, 'receivedAppLogs')
          .returns(Promise.resolve());

        activityActions.fetchAppLogs(appGuid)
          .then(done, done.fail);
      });

      it('should dispatch a LOGS_FETCH view action', () => {
        assertAction(viewSpy, activityActionTypes.LOGS_FETCH, expectedParams);
      });

      it('should call cfApi.fetchAppLogs', function () {
        expect(fetchAppLogsStub).toHaveBeenCalledOnce();
      });

      it('should call receivedAppLogs', () => {
        expect(receivedAppLogsStub).toHaveBeenCalledWith(appGuid, expectedLogs);
      });
    });

    it('should dispatch a LOGS_RECEIVED server action', () => {
      const appGuid = 'app-one',
        logs = ['logs-one', 'logs-two', 'logs-three'],
        expectedParams = {
          appGuid,
          logs
        };

      const spy = setupServerSpy(sandbox);

      activityActions.receivedAppLogs(appGuid, logs);
      assertAction(spy, activityActionTypes.LOGS_RECEIVED, expectedParams);
    });
  });
});
