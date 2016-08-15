
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServiceStore from '../../../stores/service_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServiceStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceStore._data = [];
    ServiceStore._fetched = false;
    ServiceStore._fetching = false;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServiceStore._data).toBeEmptyArray();
    });
  });

  describe('on services fetch', function() {
    it('should set fetching to true, fetched to false', function() {
      ServiceStore.fetching = false;

      serviceActions.fetchAllServices('zxncvz8xcvhn32');

      expect(ServiceStore.fetching).toEqual(true);
      expect(ServiceStore.fetched).toEqual(false);
    });

    it('should call the cf api for all services belonging to the org', function() {
      var spy = sandbox.spy(cfApi, 'fetchAllServices'),
          expectedOrgGuid = 'zxncvz8xcvhn32';

      serviceActions.fetchAllServices(expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedOrgGuid);
    });
  });

  describe('on services received', function() {
    it('should set fetching to false, fetched to true', function() {
      let testRes = wrapInRes([{ guid: '3981f', name: 'adlfskzxcv' }]);
      ServiceStore.fetching = true;
      ServiceStore.fetched = false;

      serviceActions.receivedServices(testRes);

      expect(ServiceStore.fetching).toEqual(false);
      expect(ServiceStore.fetched).toEqual(true);
    });

    it('should merge in services to current data', function() {
      const sharedGuid = 'adxvcbxv';
      const expected = [
        { guid: 'zxvcjz', name: 'zxkjv' },
        { guid: sharedGuid, name: 'adlfskzxcv' }
      ];

      let testRes = wrapInRes(expected);
      ServiceStore._data = Immutable.fromJS([{ guid: sharedGuid }]);


      serviceActions.receivedServices(testRes);

      let actual = ServiceStore.getAll();

      expect(actual.length).toEqual(2);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceStore, 'emitChange');

      serviceActions.receivedServices(wrapInRes([{ guid: 'adfklj' }]));

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
