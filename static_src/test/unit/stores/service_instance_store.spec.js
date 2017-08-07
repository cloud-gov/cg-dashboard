
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher';
import cfApi from '../../../util/cf_api';
import ServiceInstanceStore from '../../../stores/service_instance_store';
import {
  SERVICE_INSTANCE_CREATE_ERROR_MAP
} from '../../../stores/service_instance_store';
import errorActions from '../../../actions/error_actions';
import serviceActions from '../../../actions/service_actions';
import { serviceActionTypes } from '../../../constants';
import ServiceStore from '../../../stores/service_store';
import ServicePlanStore from '../../../stores/service_plan_store';
import { CREATED_NOTIFICATION_TIME_MS } from '../../../stores/service_instance_store';

describe('ServiceInstanceStore', function() {
  let sandbox;

  const addServiceInstanceToStore = (guid, store) => {
    const instance = { guid: guid, url: '/' + guid };
    store._data = Immutable.fromJS([instance]);

    return instance;
  };

  beforeEach(() => {
    ServiceInstanceStore._data = Immutable.List();
    ServiceInstanceStore._createError = null;
    ServiceInstanceStore._createLoading = false;
    ServiceInstanceStore._updating = false;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServiceInstanceStore.getAll()).toBeEmptyArray();
    });

    it('should set _updating to false', () => {
      expect(ServiceInstanceStore.updating).toBe(false);
    });
  });

  describe('updating()', () => {
    it('should return the value of the _updating property', () => {
      expect(ServiceInstanceStore.updating).toBe(false);
      ServiceInstanceStore._updating = true;
      expect(ServiceInstanceStore._updating).toBe(true);
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

  describe('on service instance create ui', () => {
    it('should set createInstanceForm to object with service and plan from stores', (done) => {
      const expectedService = { guid: 'adsf3232222a' };
      const expectedServicePlan = { guid: 'zxvczvqe' };

      sandbox.stub(ServiceStore, 'get').returns(expectedService);
      sandbox.stub(ServicePlanStore, 'get').returns(expectedServicePlan);
      sandbox.stub(serviceActions, 'createInstanceFormCancel').returns(Promise.resolve());

      serviceActions.createInstanceForm('adfkjvnzxczv', 'aldsfjalqwe').then(() => {
        const actual = ServiceInstanceStore.createInstanceForm;

        expect(actual).toBeTruthy();
        expect(actual.error).toBe(null);
        expect(actual.service).toEqual(expectedService);
        expect(actual.servicePlan).toEqual(expectedServicePlan);
        done();
      }, done);
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

  describe('on SERVICE_INSTANCE_CREATE_ERROR', () => {
    const serviceInstanceError = code => {
      return { response: { data: { error_code: code } } };
    };

    it('should set error props of instance form based on error received', () => {
      const serverError = { code: 500 };
      const argumentError = serviceInstanceError('CF-MessageParseError');
      const spaceError = serviceInstanceError('CF-ServiceInstanceInvalid');
      const configError = serviceInstanceError('CF-ServiceBrokerBadResponse');
      const dupeNameError = serviceInstanceError('CF-ServiceInstanceNameTaken');
      const serverErrorMsg =
        'Error #500. Please contact cloud.gov support for help troubleshooting this issue.';

      let actual;

      serviceActions.errorCreateInstance(serverError);
      actual = ServiceInstanceStore._createInstanceForm.error;

      expect(actual).toEqual({
        description: serverErrorMsg
      });

      serviceActions.errorCreateInstance(argumentError);
      actual = ServiceInstanceStore._createInstanceForm.error;

      expect(actual).toEqual({
        description: SERVICE_INSTANCE_CREATE_ERROR_MAP['CF-MessageParseError']
      });

      serviceActions.errorCreateInstance(spaceError);
      actual = ServiceInstanceStore._createInstanceForm.error;

      expect(actual).toEqual({
        description: SERVICE_INSTANCE_CREATE_ERROR_MAP['CF-ServiceInstanceInvalid']
      });

      serviceActions.errorCreateInstance(configError);
      actual = ServiceInstanceStore._createInstanceForm.error;

      expect(actual).toEqual({
        description: SERVICE_INSTANCE_CREATE_ERROR_MAP['CF-ServiceBrokerBadResponse']
      });

      serviceActions.errorCreateInstance(dupeNameError);
      actual = ServiceInstanceStore._createInstanceForm.error;

      expect(actual).toEqual({
        description: SERVICE_INSTANCE_CREATE_ERROR_MAP['CF-ServiceInstanceNameTaken']
      });
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

    it('should set _updating flag to true', () => {
      addServiceInstanceToStore('2903fdkhgasd980', ServiceInstanceStore);

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
        serviceInstanceGuid: 'adsf'
      });

      expect(ServiceInstanceStore._updating).toBe(true);
    });
  });

  describe('on service instance delete confirm', () => {
    it('should emit a change event if the instance exists', () => {
      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      const instanceGuid = '2903fdkhgasd980';

      addServiceInstanceToStore(instanceGuid, ServiceInstanceStore);

      serviceActions.deleteInstanceConfirm(instanceGuid);;

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should add a confirmDelete key on the service instance to delete', () => {
      const instanceGuid = '2903fdkhgasd980';

      addServiceInstanceToStore(instanceGuid, ServiceInstanceStore);
      serviceActions.deleteInstanceConfirm(instanceGuid);;

      const actual = ServiceInstanceStore.get(instanceGuid);
      expect(actual.confirmDelete).toBeTruthy();
    });
  });

  describe('on service instance delete cancel', () => {
    it('should emit a change event if the instance exists', () => {
      const instanceGuid = '2903fdkhzxcvzxcv';

      addServiceInstanceToStore(instanceGuid, ServiceInstanceStore);
      serviceActions.deleteInstanceConfirm(instanceGuid);;

      const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');
      serviceActions.deleteInstanceCancel(instanceGuid);;

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should add a confirmDelete key on the service instance to delete', () => {
      const instanceGuid = 'zxcvqwehgasd980';

      addServiceInstanceToStore(instanceGuid, ServiceInstanceStore);

      serviceActions.deleteInstanceConfirm(instanceGuid);;
      let actual = ServiceInstanceStore.get(instanceGuid);
      expect(actual.confirmDelete).toBeTruthy();

      serviceActions.deleteInstanceCancel(instanceGuid);;
      actual = ServiceInstanceStore.get(instanceGuid);

      expect(actual.confirmDelete).toBeFalsy();
    });
  });

  describe('on service instance deleted', function() {
    const expectedGuid = 'macldksajpi';
    let service;

    beforeEach(() => {
      service = addServiceInstanceToStore(expectedGuid, ServiceInstanceStore);
    });

    it('should toggle _updating flag to false', () => {
      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
        serviceInstanceGuid: expectedGuid
      });

      expect(ServiceInstanceStore.updating).toBe(false);
    });

    it('should remove the service from the data', function() {
      expect(ServiceInstanceStore.get(expectedGuid)).toEqual(service);

      AppDispatcher.handleServerAction({
        type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
        serviceInstanceGuid: expectedGuid
      });

      expect(ServiceInstanceStore.get(expectedGuid)).toBeFalsy();
    });

    it('should emit a change event if found locally', function() {
      var spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

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
      response: {
        data: {
          code: 40023,
          description: 'Cannot bind',
          error_code: 'CF-BindingCannot'
        }
      }
    };

    describe('setting `error` property', () => {
      const instanceGuid = 'zvxcsdf34sint';
      const instance = { guid: instanceGuid };

      beforeEach(() => {
        ServiceInstanceStore._data = Immutable.fromJS([instance]);
      });

      afterEach(() => {
        ServiceInstanceStore._data = null;
      });

      it('should toggle the `error` and `loading` value of the instance', function() {
        serviceActions.instanceError(instanceGuid, testCFError);

        const actual = ServiceInstanceStore.get(instanceGuid);
        const expected = Object.assign({}, instance, {
          error: { description: 'Cannot bind service instance.' },
          loading: false
        });

        expect(actual).toEqual(expected);
      });

      it('should emit change if errored instance found', function() {
        const spy = sandbox.spy(ServiceInstanceStore, 'emitChange');

        serviceActions.instanceError('fake-guid', testCFError);
        serviceActions.instanceError(instanceGuid, testCFError);
        serviceActions.instanceError(instanceGuid, testCFError);

        expect(spy).toHaveBeenCalledOnce();
      });
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

  describe('on errorActionTypes.CLEAR', () => {
    it('removes all errors from store and service instances', () => {
      ServiceInstanceStore._data = Immutable.fromJS([{ error: {} }]);
      ServiceInstanceStore._createError = 'An error!';

      errorActions.clearErrors();

      expect(ServiceInstanceStore.createError).toBe(null);
      expect(ServiceInstanceStore._data.toArray()[0].get('error')).toBe(null);
    });
  });
});
