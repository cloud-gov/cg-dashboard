
import '../../global_setup.js';

import Immutable from 'immutable';

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
    ServiceInstanceStore._data = Immutable.List();
    ServiceInstanceStore._createError = null;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServiceInstanceStore.getAll()).toBeEmptyArray();
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
    it('should merge in the service instance', function() {
      const spy = sandbox.spy(ServiceInstanceStore, 'merge');
      const instance = {
        metadata: {
          guid: 'zxmcvn23vlkxmcvn'
        },
        entity: {
          name: 'testa'
        }
      };
      const expected = unwrapOfRes([instance])[0];

      serviceActions.receivedInstance(instance);

      expect(spy).toHaveBeenCalledOnce();
      let arg1 = spy.getCall(0).args[0];
      let arg2 = spy.getCall(0).args[1];
      expect(arg1).toEqual('guid');
      expect(arg2).toEqual(expected);
    });

    it('should emit a change event', function() {

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

  describe('on service instance create form cancel', function() {
    it('should emit a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.createInstanceFormCancel();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set the create instance form to null', function() {
      ServiceInstanceStore._createInstanceForm = true;

      serviceActions.createInstanceFormCancel();

      expect(ServiceInstanceStore.createInstanceForm).toBeFalsy();
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
    it('should fetch the created instance with guid', function() {
      const spy = sandbox.spy(cfApi, 'fetchServiceInstance');
      const expectedGuid = 'akdfjzxcv32dfmnv23';

      serviceActions.createdInstance({ metadata: {guid: expectedGuid }});

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });

    it('emits a change event', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.createdInstance({ metadata: {guid: 'adsfavzxc' }});

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set form to nothing', function() {
      ServiceInstanceStore._createInstanceForm = { service: {} };
      expect(ServiceInstanceStore.createInstanceForm).toBeTruthy();
      serviceActions.createdInstance(
        { metadata: { guid: 'asdf9a8fasss', name: 'nameA' }});

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

      ServiceInstanceStore.push(expected);

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });
  });

  describe('on service instance delete confirm', function() {
    it('should emit a change event if the instance exists', function() {
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      const instanceGuid = '2903fdkhgasd980';
      let existingInstance = {
        guid: instanceGuid
      };

      ServiceInstanceStore._data = Immutable.fromJS([existingInstance]);

      serviceActions.deleteInstanceConfirm(instanceGuid);;

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should add a confirmDelete key on the service instance to delete',
       function() {
      const instanceGuid = '2903fdkhgasd980';
      let existingInstance = {
        guid: instanceGuid
      };

      ServiceInstanceStore._data = Immutable.fromJS([existingInstance]);
      serviceActions.deleteInstanceConfirm(instanceGuid);;

      const actual = ServiceInstanceStore.get(instanceGuid);
      expect(actual.confirmDelete).toBeTruthy();
    });
  });

  describe('on service instance delete cancel', function() {
    it('should emit a change event if the instance exists', function() {
      const instanceGuid = '2903fdkhzxcvzxcv';
      let existingInstance = {
        guid: instanceGuid
      };

      ServiceInstanceStore._data = Immutable.fromJS([existingInstance]);
      serviceActions.deleteInstanceConfirm(instanceGuid);;

      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      serviceActions.deleteInstanceCancel(instanceGuid);;

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should add a confirmDelete key on the service instance to delete',
       function() {
      const instanceGuid = 'zxcvqwehgasd980';
      let existingInstance = {
        guid: instanceGuid
      };

      ServiceInstanceStore._data = Immutable.fromJS([existingInstance]);
      serviceActions.deleteInstanceConfirm(instanceGuid);;
      let actual = ServiceInstanceStore.get(instanceGuid);
      expect(actual.confirmDelete).toBeTruthy();

      serviceActions.deleteInstanceCancel(instanceGuid);;
      actual = ServiceInstanceStore.get(instanceGuid);

      expect(actual.confirmDelete).toBeFalsy();
    });
  });

  describe('on service instance deleted', function() {
    it('should remove the service from the data', function() {
      var expectedGuid = 'macldksajpi',
          expected = { guid: expectedGuid, url: '/' + expectedGuid };

      ServiceInstanceStore.push(expected);

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

      ServiceInstanceStore._data = Immutable.fromJS([expected]);

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
