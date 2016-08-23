
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ActivityStore from '../../../stores/activity_store.js';
import { activityActionTypes } from '../../../constants';

describe('ActivityStore', function() {
  var sandbox;

  beforeEach(() => {
    ActivityStore._data = Immutable.List();
    ActivityStore._fetching = false;
    ActivityStore._fetched = false;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(ActivityStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on event fetch', function () {
    it('should call cfApi.fetchSpaceEvents', function () {
      var spy = sandbox.spy(cfApi, 'fetchSpaceEvents');

      AppDispatcher.handleViewAction({
        type: activityActionTypes.EVENTS_FETCH,
        spaceGuid: 'fakeSpaceGuid'
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set fetching to true fetched to false', function() {
      AppDispatcher.handleViewAction({
        type: activityActionTypes.EVENTS_FETCH,
        spaceGuid: 'fakeSpaceGuid'
      });

      expect(ActivityStore.fetched).toEqual(false);
      expect(ActivityStore.fetching).toEqual(true);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(ActivityStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: activityActionTypes.EVENTS_FETCH,
        spaceGuid: 'fakeSpaceGuid'
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on events received', function () {
    it('should merge activity and emit change', function () {
      const activity = [
        {
          guid: 'fakeActivityGuidOne',
          name: 'fakeActivityNameOne',
          activity_type : 'event'
        },
        {
          guid: 'fakeActivityGuidTwo',
          name: 'fakeActivityNameTwo',
          activity_type : 'event'
        }
      ];
      const spy = sandbox.spy(ActivityStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: activityActionTypes.EVENTS_RECEIVED,
        events: wrapInRes(activity)
      });


      expect(ActivityStore.getAll()).toEqual(activity);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set fetched to true, fetching to false', function() {
      const activity = [
        {
          guid: 'fakeActivityGuidOne',
          activity_type : 'event'
        }
      ];

      AppDispatcher.handleServerAction({
        type: activityActionTypes.EVENTS_RECEIVED,
        events: wrapInRes(activity)
      });

      expect(ActivityStore.fetched).toEqual(true);
      expect(ActivityStore.fetching).toEqual(false);
    });
  });

  describe('on logs fetch', function () {
    it('should call cfApi.fetchAppLogs', function () {
      var spy = sandbox.spy(cfApi, 'fetchAppLogs');

      AppDispatcher.handleViewAction({
        type: activityActionTypes.LOGS_FETCH,
        appGuid: 'fakeAppGuid'
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set fetching to true fetched to false', function() {
      AppDispatcher.handleViewAction({
        type: activityActionTypes.LOGS_FETCH,
        appGuid: 'fakeAppGuid'
      });

      expect(ActivityStore.fetched).toEqual(false);
      expect(ActivityStore.fetching).toEqual(true);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(ActivityStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: activityActionTypes.LOGS_FETCH,
        appGuid: 'fakeAppGuid'
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on logs received', function () {
    it('should merge activity and emit change', function () {
      const logs = [
        {
          message: "federalist.18f.gov - [17/08/2016:00:09:56.467 +0000] \"GET /socket.io/?__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=browser&__sails_io_sdk_language=javascript&EIO=3&transport=polling&t=1471392596201-8120 HTTP/1.1\" 200 0 90 \"https://federalist.18f.gov/\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36\" 127.0.0.1:34350 x_forwarded_for:\"50.0.192.84\" x_forwarded_proto:\"https\" vcap_request_id:5e288c8d-d9d8-4589-7956-0427ab11e33f response_time:0.003466191 app_id:32f77e21-d504-4b4a-91c3-ea4c6bcc47e5\n"
        }
      ];

      const spy = sandbox.spy(ActivityStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: activityActionTypes.LOGS_RECEIVED,
        logs
      });

      expect(ActivityStore.getAll().length).toEqual(1);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set fetched to true, fetching to false', function() {
      const logs = [
        {
          message: "federalist.18f.gov - [17/08/2016:00:09:56.467 +0000] \"GET /socket.io/?__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=browser&__sails_io_sdk_language=javascript&EIO=3&transport=polling&t=1471392596201-8120 HTTP/1.1\" 200 0 90 \"https://federalist.18f.gov/\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36\" 127.0.0.1:34350 x_forwarded_for:\"50.0.192.84\" x_forwarded_proto:\"https\" vcap_request_id:5e288c8d-d9d8-4589-7956-0427ab11e33f response_time:0.003466191 app_id:32f77e21-d504-4b4a-91c3-ea4c6bcc47e5\n"
        }
      ];

      AppDispatcher.handleServerAction({
        type: activityActionTypes.LOGS_RECEIVED,
        logs
      });

      expect(ActivityStore.fetched).toEqual(true);
      expect(ActivityStore.fetching).toEqual(false);
    });
  });

  describe('parseLogItem()', function () {
    it('should parse log items', function () {
      const logs = [
        {
          message: "federalist.18f.gov - [17/08/2016:00:09:56.467 +0000] \"GET /socket.io/?__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=browser&__sails_io_sdk_language=javascript&EIO=3&transport=polling&t=1471392596201-8120 HTTP/1.1\" 200 0 90 \"https://federalist.18f.gov/\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36\" 127.0.0.1:34350 x_forwarded_for:\"50.0.192.84\" x_forwarded_proto:\"https\" vcap_request_id:5e288c8d-d9d8-4589-7956-0427ab11e33f response_time:0.003466191 app_id:32f77e21-d504-4b4a-91c3-ea4c6bcc47e5\n"
        }
      ];
      const expected = [
        {
          app_guid: "32f77e21-d504-4b4a-91c3-ea4c6bcc47e5",
          raw: logs[0],
          host: "federalist.18f.gov",
          guid: "2016-08-17 00:09 +00005e288c8d-d9d8-4589-7956-0427ab11e33f",
          activity_type: "log",
          metadata: {
            x_forward_for: "50.0.192.84",
            x_forward_proto: "https",
            vcap_request_id: "5e288c8d-d9d8-4589-7956-0427ab11e33f",
            response_time: "0.003466191"
          },
          timestamp: "2016-08-17 00:09 +0000",
          protocol: "HTTP/1.1",
          status_code:200,
          requested_url: "GET /socket.io/?__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=browser&__sails_io_sdk_language=javascript&EIO=3&transport=polling&t=1471392596201-8120 "
        }
      ];

      AppDispatcher.handleServerAction({
        type: activityActionTypes.LOGS_RECEIVED,
        logs
      });

      expect(ActivityStore.getAll()).toEqual(expected);
    })
  })
});
