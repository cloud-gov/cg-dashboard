
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import ServiceStore from '../../../stores/service_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServiceStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceStore._data = [];
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
    it('should set loading to true', function() {
      serviceActions.fetchAllServices('zxncvz8xcvhn32');

      expect(ServiceStore.loading).toEqual(true);
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
    it('should merge in services to current data', function() {
      const sharedGuid = 'adxvcbxv';
      const expected = [
        { guid: 'zxvcjz', name: 'zxkjv' },
        { guid: sharedGuid, name: 'adlfskzxcv' }
      ];

      let testRes = expected;
      ServiceStore._data = Immutable.fromJS([{ guid: sharedGuid }]);


      serviceActions.receivedServices(testRes);

      let actual = ServiceStore.getAll();

      expect(actual.length).toEqual(2);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceStore, 'emitChange');

      serviceActions.receivedServices([{ guid: 'adfklj' }]);

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
