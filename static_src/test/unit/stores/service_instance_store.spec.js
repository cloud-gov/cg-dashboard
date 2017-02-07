
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import ServiceInstanceStore from '../../../stores/service_instance_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';
import ServiceStore from '../../../stores/service_store.js';
import ServicePlanStore from '../../../stores/service_plan_store.js';
import { CREATED_NOTIFICATION_TIME_MS } from '../../../stores/service_instance_store.js';

describe('ServiceInstanceStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceInstanceStore._data = Immutable.List();
    ServiceInstanceStore._createError = null;
    ServiceInstanceStore._createLoading = false;
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

  describe('getInstanceState()', function() {
    it('should return running if last op doesnt exist', function() {
      const actual = ServiceInstanceStore.getInstanceState({});

      expect(actual).toEqual('running');
    });

    it('should return failed if last op state was failed', function() {
      const instance = {
        last_operation: {
          state: 'failed'
        }
      }
      const actual = ServiceInstanceStore.getInstanceState(instance);

      expect(actual).toEqual('failed');
    });

    it('should return deleting if last op type was delete', function() {
      const instance = {
        last_operation: {
          type: 'delete'
        }
      }
      const actual = ServiceInstanceStore.getInstanceState(instance);

      expect(actual).toEqual('deleting');
    });

    it('should return running if not failed or deleting', function() {
      const instance = {
        last_operation: {
          type: 'create',
          state: 'success'
        }
      }
      const actual = ServiceInstanceStore.getInstanceState(instance);

      expect(actual).toEqual('running');
    });
  });

  describe('getServiceBindingForApp()', function() {
    it('should return null if no service bindings', function() {
      const instance = { serviceBindings: []};

      const actual = ServiceInstanceStore.getServiceBindingForApp('', instance);

      expect(actual).toBeFalsy();
    });

    it('should return binding object if matches app guid passed in', function() {
      const appGuid = 'zcvn238vnma';
      const binding = { guid: 'zcxv', app_guid: appGuid };
      const instance = { serviceBindings: [binding] };

      const actual = ServiceInstanceStore.getServiceBindingForApp(appGuid,
        instance);

      expect(actual).toEqual(binding);
    });
  });

  describe('isInstanceBound()', function() {
    it('should return false if no service bindings on instance passed in',
      function() {
      const instance = { serviceBindings: []};

      const actual = ServiceInstanceStore.isInstanceBound(instance);

      expect(actual).toBeFalsy();
    });

    it('should return false if none of bindings passed in found on instance',
      function() {
      const instance = { serviceBindings: [{ guid: 'adsf'}]};
      const binding = { guid: '230984' };
      const bindings = [binding];

      const actual = ServiceInstanceStore.isInstanceBound(instance, bindings);

      expect(actual).toBeFalsy();
    });

    it('should return true if bindings passed in found on instance', function() {
      const bindingGuid = 'zxklvcj234czxb';
      const instance = { serviceBindings: [{ guid: bindingGuid}]};
      const binding = { guid: bindingGuid };
      const bindings = [binding];

      const actual = ServiceInstanceStore.isInstanceBound(instance, bindings);

      expect(actual).toBeTruthy();

    });
  });

  describe('on service instances fetch', function () {
    it('should be loading', function () {
      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCES_FETCH,
        spaceGuid: 'fakeguid'
      });

      expect(ServiceInstanceStore.loading).toEqual(true);
    });
  });

  describe('on service instance received', function() {
    it('should merge in the service instance', function() {
      const spy = sandbox.spy(ServiceInstanceStore, 'merge');
      const instance = {
        guid: 'zxmcvn23vlkxmcvn',
        name: 'testa'
      };
      const expected = instance;

      serviceActions.receivedInstance(instance);

      expect(spy).toHaveBeenCalledOnce();
      let arg1 = spy.getCall(0).args[0];
      let arg2 = spy.getCall(0).args[1];
      expect(arg1).toEqual('guid');
      expect(arg2).toEqual(expected);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      const instance = {
        guid: 'zxmcvn23vlkxmcvn',
        name: 'testa'
      };
      const expected = instance;

      serviceActions.receivedInstance(instance);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service instances received', function() {
    it('should set data  passed in instances', function() {
      var expected = [
        {
          guid: 'adfa',
          type: 'postgres'
        }
      ];
      let testRes = expected;
      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
        serviceInstances: testRes
      });

      expect(ServiceInstanceStore.getAll().length).toEqual(1);
      expect(ServiceInstanceStore.getAll()).toEqual(expected);
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

  describe('on service instance created', function () {
    it('emits a change event', function () {
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.createdInstance({ guid: 'adsfavzxc' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set created temporary notification to true', function () {
      serviceActions.createdInstance(
        { guid: 'asdf9a8fasss', name: 'nameA' });

      expect(ServiceInstanceStore.createdTempNotification).toBeTruthy();
    });
  });

  describe('on service instance delete', function () {
    it('should do nothing if the service isn\'t in data', function () {
      const spy = sandbox.spy(cfApi, 'deleteUnboundServiceInstance');

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: 'adsf'
      });

      expect(spy).not.toHaveBeenCalled();
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

  describe('on service bound', function() {
    const testGuid = 'zcxvnvb324';
    const testInstance = {
      guid: testGuid
    };

    it('should set change check, error on instance to false', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);

      const binding = {
        guid: 'zxc' ,
        service_instance_guid: testGuid
      };

      serviceActions.boundService(binding);

      const actual = ServiceInstanceStore.get(testGuid);

      expect(actual).toBeDefined();
      expect(actual.changing).toBeFalsy();
      expect(actual.error).toBeFalsy();
    });

    it('should emit a change', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      const binding = {
        guid: 'zxc' ,
        service_instance_guid: testGuid
      };

      serviceActions.boundService(binding);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should unset loading', function() {
      const testInstance = {
        guid: testGuid,
        loading: 'Binding'
      };
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);

      const binding = {
        guid: 'zxc',
        service_instance_guid: testGuid
      };

      serviceActions.boundService(binding);

      const actual = ServiceInstanceStore.get(testGuid);
      expect(actual.loading).toBeFalsy();
    });
  });

  describe('on service instance change check', function() {
    const testGuid = 'zcxvnvb324';
    const testInstance = {
      guid: testGuid
    };

    it('should set change check on instance to true', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);

      serviceActions.changeServiceInstanceCheck(testGuid);

      const actual = ServiceInstanceStore.get(testGuid);

      expect(actual).toBeDefined();
      expect(actual.changing).toBeTruthy();
    });

    it('should emit a change', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.changeServiceInstanceCheck(testGuid);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service instance change cancel', function() {
    const testGuid = 'zcxvnvb324';
    const testInstance = {
      guid: testGuid,
      changing: true
    };

    it('should set change check on instance to false', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);

      serviceActions.changeServiceInstanceCancel(testGuid);

      const actual = ServiceInstanceStore.get(testGuid);
      expect(actual).toBeDefined();
      expect(actual.changing).toBeFalsy();
    });

    it('should emit a change', function() {
      ServiceInstanceStore._data = Immutable.fromJS([testInstance]);
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.changeServiceInstanceCancel(testGuid);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on instance error', function() {
    const testCFError = {
      code: 40023,
      description: 'Cannot bind',
      error_code: 'CF-BindingCannot'
    };

    it('should toggle the error value of the instance', function() {
      const instanceGuid = 'zvxcsdf34sint';
      const instance = { guid: instanceGuid };
      const err = testCFError;

      ServiceInstanceStore.push(instance);

      serviceActions.instanceError(instanceGuid, err);

      const actual = ServiceInstanceStore.get(instanceGuid);
      const expected = Object.assign({}, instance, {
        error: err
      });

      expect(actual).toEqual(expected);
    });

    it('should emit change if errored instance found', function() {
      const instanceGuid = 'zvxcsdf34sint';
      const instance = { guid: instanceGuid };
      const err = testCFError;

      ServiceInstanceStore.push(instance);

      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

      serviceActions.instanceError('fake-guid', err);
      serviceActions.instanceError(instanceGuid, err);
      serviceActions.instanceError(instanceGuid, err);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service bind', function() {
    it('should emit a change event', function() {
      const serviceInstanceGuid = 'zxvcadsf23bv';
      const instance = { guid: serviceInstanceGuid };

      ServiceInstanceStore.push(instance);

      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      serviceActions.bindService('zvcx', serviceInstanceGuid);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set loading to Binding', function() {
      const serviceInstanceGuid = 'zxvcadsf23bv';
      const instance = { guid: serviceInstanceGuid };

      ServiceInstanceStore.push(instance);

      serviceActions.bindService('zvcx', serviceInstanceGuid);

      const actual = ServiceInstanceStore.get(serviceInstanceGuid);

      expect(actual.loading).toEqual('Binding');
    });
  });

  describe('on service unbind', function() {
    it('should emit a change event', function() {
      const serviceInstanceGuid = 'zxvcadsf23bv';
      const instance = { guid: serviceInstanceGuid };
      const binding = { guid: 'zxcvzxc',
        service_instance_guid: serviceInstanceGuid };

      ServiceInstanceStore.push(instance);

      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      serviceActions.unbindService(binding);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set loading to Binding', function() {
      const serviceInstanceGuid = 'zxvcadsf23bv';
      const instance = { guid: serviceInstanceGuid };
      const binding = { guid: 'zxcvzxc',
        service_instance_guid: serviceInstanceGuid };

      ServiceInstanceStore.push(instance);

      serviceActions.unbindService(binding);

      const actual = ServiceInstanceStore.get(serviceInstanceGuid);

      expect(actual.loading).toEqual('Unbinding');
    });
  });
});
