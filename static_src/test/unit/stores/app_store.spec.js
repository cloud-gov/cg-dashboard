
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import AppStore from '../../../stores/app_store.js';
import { appActionTypes } from '../../../constants';

describe('AppStore', function() {
  var sandbox;

  beforeEach(() => {
    AppStore._data = Immutable.List();
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
      var spy = sandbox.spy(AppStore, 'emitChange');
      var app = { guid: 'asdf' };

      AppStore.push(app);

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
});
