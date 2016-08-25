
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServiceBindingStore from '../../../stores/service_binding_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServiceBindingStore', function() {
  var sandbox;

  beforeEach(() => {
    ServiceBindingStore._data = Immutable.List();
    ServiceBindingStore._fetching = false;
    ServiceBindingStore._fetched = false;
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

    it('should set fetching to true, fetched to false', function() {
      ServiceBindingStore.fetching = false;
      serviceActions.fetchServiceBindings('zxncvz8xcvhn32');

      expect(ServiceBindingStore.fetching).toEqual(true);
      expect(ServiceBindingStore.fetched).toEqual(false);
    });

    it('should emit a change', function() {
      const spy = sandbox.spy(ServiceBindingStore, 'emitChange');
      serviceActions.fetchServiceBindings('zxncvz8xcvhn32');

      expect(spy).toHaveBeenCalledOnce();
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

    it('should set fetching to false, fetched to true', function() {
      ServiceBindingStore.fetching = true;
      serviceActions.receivedServiceBindings(fakeBindings);

      expect(ServiceBindingStore.fetching).toEqual(false);
      expect(ServiceBindingStore.fetched).toEqual(true);
    });

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
});
