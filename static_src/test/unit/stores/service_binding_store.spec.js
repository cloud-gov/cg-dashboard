
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import ServiceBindingStore from '../../../stores/service_binding_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServiceBindingStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceBindingStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServiceBindingStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on service bindings fetch', function() {
    it('should call the cf api for all service bindings with app guid',
        function() {
      const spy = sandbox.spy(cfApi, 'fetchServiceBindings');
      const expectedAppGuid = 'zxncvz8xcvhn32';

      serviceActions.fetchServiceBindings(expectedAppGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedAppGuid);
    });

    it('should set loading to true', function() {
      serviceActions.fetchServiceBindings('zxncvz8xcvhn32');

      expect(ServiceBindingStore.loading).toEqual(true);
    });

    it('should emit a change', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');
      serviceActions.fetchServiceBindings('zxncvz8xcvhn32');

      // change is emitted twice, once on the action, once for loading status
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getAllByApp()', function() {
    it('should return all bindings by app guid', function() {
      const appGuid = 'zxclvkjzxcvsdf23';
      const bindingA = { guid: 'binda', app_guid: appGuid };
      const bindingB = { guid: 'bindb', app_guid: appGuid };

      ServiceBindingStore._data = Immutable.fromJS([bindingA, bindingB]);

      const actual = ServiceBindingStore.getAllByApp(appGuid)

      expect(actual).toBeTruthy();
      expect(actual.length).toEqual(2);
      expect(actual).toContain(bindingA);
      expect(actual).toContain(bindingB);
    });
  });

  describe('on service bindings received', function() {
    const fakeBindings = [
      { metadata: { guid: 'adsfa' }, entity: { service_instance_guid: 'zcv'} }
    ];

    it('should emit a change', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');
      serviceActions.receivedServiceBindings(fakeBindings);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge many with guid', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'mergeMany');
      serviceActions.receivedServiceBindings(fakeBindings);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('guid');
    });
  });

  describe('on service bind', function() {
    it('should call api create binding with app, instance guid', function() {
      const spy = sandbox.stub(cfApi, 'createServiceBinding');
      spy.returns(Promise.resolve({data: {}}));
      const appGuid = 'adfa3456vc';
      const serviceInstanceGuid = 'zvcx234';

      serviceActions.bindService(appGuid, serviceInstanceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(appGuid);
      expect(args[1]).toEqual(serviceInstanceGuid);
    });
  });

  describe('on service unbind', function() {
    it('should call api delete binding with binding', function() {
      const spy = sandbox.stub(cfApi, 'deleteServiceBinding');
      spy.returns(Promise.resolve({data: {}}))
      const binding = {
        guid: 'zxvadf'
      }

      serviceActions.unbindService(binding);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(binding);
    });
  });

  describe('on service bound', function() {
    const bindingGuid = 'xcvm,n32980cvxn';
    const testBinding = {
      guid: bindingGuid,
      app_guid: 'zcxv32',
      service_instance_guid: 'xxcv2133'
    };

    it('should add the new binding to the store', function() {
      const bindingGuid = 'xcvm,n32980cvxn';
      const expected = testBinding;

      serviceActions.boundService(expected);

      const actual = ServiceBindingStore.get(bindingGuid);

      expect(actual).toBeTruthy();
      expect(actual).toEqual(expected);
    });

    it('should emit a change', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');

      serviceActions.boundService(testBinding);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on service unbound', function() {
    const testBinding = {
      guid: '2dfg25sd',
      app_guid: 'zcvx234xcb',
      service_instance_guid: 'zxcv234bvc'
    };

    it('should remove the service binding', function() {
      ServiceBindingStore._data = Immutable.fromJS([testBinding]);

      serviceActions.unboundService(testBinding);

      expect(ServiceBindingStore.get(testBinding.guid)).toBeFalsy();
    });

    it('should do nothing if service binding not found', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');
      serviceActions.unboundService(testBinding);

      expect(spy).not.toHaveBeenCalledOnce();
    });

    it('should emit a change', function() {
      ServiceBindingStore._data = Immutable.fromJS([testBinding]);
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');

      serviceActions.unboundService(testBinding);

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
