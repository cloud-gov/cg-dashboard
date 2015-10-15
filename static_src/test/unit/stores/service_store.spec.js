
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServiceStore from '../../../stores/service_store.js';
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

  describe('getAll()', () => {
    it('should return a list of services', () => {
      expect(ServiceStore.getAll()).toBeArray();
    });
  });

  describe('on service instances fetch', function() {
    it('should fetch service instances from api with space guid', function() {
      var spy = sandbox.spy(cfApi, 'fetchServiceInstances'),
          expectedSpaceGuid = '9998sdfa;dksa';

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCES_FETCH,
        spaceGuid: expectedSpaceGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedSpaceGuid);
    });
  });

  describe('on service instances received', function() {
    it('should set data to unwrapped, passed in instances', function() {
      var expected = [
        {
          guid: 'adfa',
          type: 'postgres'
        }
      ];
      let testRes = wrapInRes(expected);
      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
        serviceInstances: testRes
      });

      expect(ServiceStore.getAll().length).toEqual(1);
      expect(ServiceStore.getAll()).toEqual(expected);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
        serviceInstances: []
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
