
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

  describe('on service bindings received', function() {

  });
});
