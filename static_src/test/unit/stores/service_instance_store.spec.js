
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServiceInstanceStore from '../../../stores/service_instance_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';
import ServiceStore from '../../../stores/service_store.js';
import ServicePlanStore from '../../../stores/service_plan_store.js';

describe('ServiceInstanceStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceInstanceStore._data = [];
    ServiceInstanceStore._createError = null;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServiceInstanceStore._data).toBeEmptyArray();
    });
  });

  describe('get createError()', function() {
    it('should return createError', function() {
      var expected = {msg: 'adsf'};
      let actual = ServiceInstanceStore.createError;

      expect(actual).toBeFalsy();
      ServiceInstanceStore._createError = expected;
      actual = ServiceInstanceStore.createError;
      expect(actual).toEqual(expected);
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

      expect(ServiceInstanceStore.getAll().length).toEqual(1);
      expect(ServiceInstanceStore.getAll()).toEqual(expected);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
        serviceInstances: []
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service instance create ui', function() {
    it('should set createInstanceForm to object with service and plan from stores',
        function() {
      var expectedService = { guid: 'adsf3232222a' },
          expectedServicePlan = { guid: 'zxvczvqe' };

      sandbox.stub(ServiceStore, 'get').returns(expectedService);
      sandbox.stub(ServicePlanStore, 'get').returns(expectedServicePlan);
      
      serviceActions.createInstanceForm('adfkjvnzxczv', 'aldsfjalqwe');

      let actual = ServiceInstanceStore.createInstanceForm;

      expect(actual).toBeTruthy();
      expect(actual.service).toEqual(expectedService);
      expect(actual.servicePlan).toEqual(expectedServicePlan);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.createInstanceForm('adfkjvnzxczv', 'aldsfjalqwe');

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service instance create', function() {
    it('should call an api method to create a service instance', function() {
      var spy = sandbox.spy(cfApi, 'createServiceInstance'),
          expectedName = 'blah',
          expectedSpaceGuid = 'q9208fhdasl',
          expectedServicePlanGuid = 'a098fduadshf2';

      serviceActions.createInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expectedName, expectedSpaceGuid,
                                       expectedServicePlanGuid);
    });
  });

  describe('on instance create error', function() {
    it('should set create error to passed in error', function() {
      var expectedError = { status: 500 };

      serviceActions.errorCreateInstance(expectedError);

      let actual = ServiceInstanceStore.createError;

      expect(actual).toBeTruthy();
      expect(actual).toEqual(expectedError);
    });

    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.errorCreateInstance({ status: 500 });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on sevice instance created', function() {
    it('should add received instance to the data', function() {
      var expectedInstance = { guid: 'asdf9a8fasss' };

      ServiceInstanceStore._data.push({ guid: 'zzxcvz' });

      serviceActions.createdInstance(expectedInstance);

      expect(ServiceInstanceStore.get(expectedInstance.guid)).toEqual(
        expectedInstance);
    });

    it('theres a store with the same guid, it should update that store',
        function() {
      var expectedInstance = { guid: 'asdf9a8fasss', name: 'nameA' };

      ServiceInstanceStore._data.push(expectedInstance);

      let newInstance = Object.assign({}, expectedInstance);
      newInstance.name = 'nameB';

      serviceActions.createdInstance(newInstance);

      expect(ServiceInstanceStore.getAll().length).toEqual(1);
      let actual = ServiceInstanceStore.get(expectedInstance.guid);
      expect(actual.name).toEqual(newInstance.name);
    });

    it('emits a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.createdInstance({ guid: 'adsfavzxc' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set form to nothing', function() {
      ServiceInstanceStore._createInstanceForm = { service: {} };
      expect(ServiceInstanceStore.createInstanceForm).toBeTruthy();
      serviceActions.createdInstance({ guid: 'asdf9a8fasss', name: 'nameA' });

      expect(ServiceInstanceStore.createInstanceForm).toBeFalsy();
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

      ServiceInstanceStore._data.push(expected);

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });
  });

  describe('on service instance deleted', function() {
    it('should remove the service from the data', function() {
      var expectedGuid = 'macldksajpi',
          expected = { guid: expectedGuid, url: '/' + expectedGuid };

      ServiceInstanceStore._data.push(expected);

      expect(ServiceInstanceStore.get(expectedGuid)).toEqual(expected);

      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
        serviceInstanceGuid: expectedGuid
      });

      expect(ServiceInstanceStore.get(expectedGuid)).toBeFalsy();
    });

    it('should emit a change event if found locally', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      var expectedGuid = 'macldksajpi',
          expected = { guid: expectedGuid, url: '/' + expectedGuid };

      ServiceInstanceStore._data.push(expected);

      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
        serviceInstanceGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not emit a change event if not found locally', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
        serviceInstanceGuid: 'adsfas' 
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
