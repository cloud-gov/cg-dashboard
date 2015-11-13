
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServiceStore from '../../../stores/service_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServiceInstanceStore', function() {
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
    it('should set the passed in services to current data', function() {
      var expected = [
        { guid: 'zxvcjz', name: 'zxkjv' },
        { guid: '3981f', name: 'adlfskzxcv' }
      ];

      let testRes = wrapInRes(expected);
      ServiceStore._data = [{ guid: 'alkdjsfzxcv' }];

      serviceActions.receivedServices(testRes);

      let actual = ServiceStore.getAll();

      expect(actual.length).toEqual(2);
      expect(actual).toEqual(expected);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceStore, 'emitChange');

      serviceActions.receivedServices(wrapInRes([{ guid: 'adfklj' }]));

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
