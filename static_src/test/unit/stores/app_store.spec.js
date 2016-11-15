
import Immutable from 'immutable';

import '../../global_setup.js';

import appActions from '../../../actions/app_actions.js';
import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import AppStore from '../../../stores/app_store.js';
import { appActionTypes } from '../../../constants';

describe('AppStore', function() {
  var sandbox;

  beforeEach(() => {
    AppStore._data = Immutable.List();
    AppStore._currentAppGuid = null;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(AppStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on app fetch', function() {
    it('should fetch app with guid from api', function() {
      var spy = sandbox.spy(cfApi, 'fetchApp'),
          expectedGuid = 'adfasd.vdam;dksa';

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_FETCH,
        appGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on app stats fetch', function() {
    it('should fetch app stats with guid from api', function() {
      var spy = sandbox.spy(cfApi, 'fetchAppStats'),
          expectedGuid = 'adfasddksazxcvzxcvz';

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_STATS_FETCH,
        appGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on app all fetch', function() {
    it('should fetch all of an app\'s information from api', function() {
      var spy = sandbox.spy(cfApi, 'fetchAppAll'),
          expectedGuid = 'adfasddksazxcvzxcvz';

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_ALL_FETCH,
        appGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
      expect(AppStore.loading).toEqual(true);
    });
  });

  describe('on app received', function() {
    it('should emit a change event if data was updated', function() {
      var spy = sandbox.spy(AppStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_RECEIVED,
        app: { guid: 'asdf' }
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change event if data was not changed', function() {
      var app = { guid: 'asdf' };

      AppStore.push(app);

      const spy = sandbox.spy(AppStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_RECEIVED,
        app: app
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge app with existing app if it exists', function() {
      var sharedGuid = 'cmadkljcsa';

      let existingApp = { guid: sharedGuid, name: 'adsfa' };
      let newApp = { guid: sharedGuid, instances: [{ guid: 'dfs' }] }

      AppStore.push(existingApp);

      expect(AppStore.get(sharedGuid)).toEqual(existingApp);

      AppDispatcher.handleServerAction({
        type: appActionTypes.APP_RECEIVED,
        app: newApp
      });

      let actual = AppStore.get(sharedGuid);
      expect(actual).toEqual({ guid: sharedGuid, name: 'adsfa',
          instances: [{ guid: 'dfs' }] });
    });

    it('should add app to data if it doesn\'t already exist', function() {
      var expectedGuid = 'adcasdc',
          expected = { guid: expectedGuid, name: 'asdf' };

      AppDispatcher.handleServerAction({
        type: appActionTypes.APP_RECEIVED,
        app: expected
      });

      let actual = AppStore.get(expectedGuid);
      expect(actual).toEqual(expected);
    });
  });

  describe('on app all received', function() {
    it('should emit change', function() {
      var spy = sandbox.spy(AppStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_ALL_RECEIVED,
        appGuid: 'asdf'
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on app stats received', function() {
    it('should emit a change event if data was updated', function() {
      const sharedGuid = '2893hazxcmv';

      let existingApp = { guid: sharedGuid, name: 'asddd' };
      AppStore.push(existingApp);

      const spy = sandbox.spy(AppStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: appActionTypes.APP_STATS_RECEIVED,
        appGuid: sharedGuid,
        app: { stats: {} }
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge app stats with existing app if it exists', function() {
      var sharedGuid = 'cmadkljcsa';

      let existingApp = { guid: sharedGuid, name: 'adsfa' };
      let newApp = { stats: { mem_quota: 123543 }};

      AppStore.push(existingApp);
      expect(AppStore.get(sharedGuid)).toEqual(existingApp);

      AppDispatcher.handleServerAction({
        type: appActionTypes.APP_STATS_RECEIVED,
        appGuid: sharedGuid,
        app: newApp
      });

      let actual = AppStore.get(sharedGuid);
      expect(actual).toEqual({ guid: sharedGuid, name: 'adsfa',
          stats: { mem_quota: 123543 }});
    });

    it('should create a new app if it doesn\'t already exist', function() {
      var expectedGuid = 'adcasdcccsss',
          expected = {stats: { mem_quota: 12 }};

      AppDispatcher.handleServerAction({
        type: appActionTypes.APP_STATS_RECEIVED,
        appGuid: expectedGuid,
        app: expected
      });

      let actual = AppStore.get(expectedGuid);
      expect(actual).toEqual({
        guid: expectedGuid,
        stats: { mem_quota: 12 }
      });
    });
  });

  describe('on app change current', function() {
    it('should set the current app guid to passed guid', function() {
      const expectedGuid = 'aldfjvcczxcv';

      appActions.changeCurrentApp(expectedGuid);

      expect(AppStore.currentAppGuid).toEqual(expectedGuid);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(AppStore, 'emitChange');

      appActions.changeCurrentApp('0');

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on app restart', function() {
    it('should call cf api to restart the app with guid', function() {
      const spy = sandbox.spy(cfApi, 'postAppRestart');
      const expectedGuid = 'asdfasd2vdamcdksa';

      appActions.restart(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });

    it('should set app "state" to "restarting"', function() {
      const appGuid = 'zkvkljsf';
      const app = { guid: appGuid, state: 'RUNNING' };
      AppStore.push(app);

      appActions.restart(appGuid);

      const actual = AppStore.get(appGuid);
      expect(actual.state).toEqual('RESTARTING');
    });

    it('should emit a change', function() {
      const appGuid = 'zkvkljsf';
      const app = { guid: appGuid, state: 'RUNNING' };
      AppStore.push(app);
      const spy = sandbox.spy(AppStore, 'emitChange');

      appActions.restart(appGuid);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on app restarted', function() {
    it('should poll until running instances is greater then 0', function() {
      const spy = sandbox.spy(AppStore, 'poll');
      const expectedRes = {
        data: { running_instances: 1 }
      };

      appActions.restarted('zxlcvkjklv');

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toBeFunction();
      expect(args[0](expectedRes)).toBeTruthy();
      expect(args[1]).toBeFunction();
    });
  });
});
