
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

  describe('get()', function() {
    it('should return a service if it can find it in data based on guid',
        function() {
      var expectedGuid = '8sfjlkasjdf',
          expected = { guid: expectedGuid };

      ServiceStore._data.push(expected);

      let actual = ServiceStore.get(expectedGuid);

      expect(actual).toEqual(expected);
    });

    it('should returned undefined if not found', function() {
      var testService = { guid: 'aaa' };

      ServiceStore._data.push(testService);

      let actual = ServiceStore.get('mkmkmkmkm');
      
      expect(actual).toBeFalsy();
    });
  });

  describe('getAll()', function() {
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

  describe('on service instance delete', function() {
    it('should do nothing if the service isn\'t in data', function() {
      var spy = sandbox.spy(cfApi, 'deleteUnboundServiceInstance');

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: 'adsf'
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should api delete with the service', function() {
      var spy = sandbox.spy(cfApi, 'deleteUnboundServiceInstance'),
          expectedGuid = 'qp98wfj',
          expected = { guid: expectedGuid, url: '/' + expectedGuid };

      ServiceStore._data.push(expected);

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });
  });
});
