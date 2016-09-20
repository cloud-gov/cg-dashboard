/*
 * Store for service bindings data. Bindings are what link apps to service
 * instances.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';

class ServiceBindingStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
  }

  getAllByApp(appGuid) {
    return this.getAll().filter((binding) =>
      binding.app_guid === appGuid
    );
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_BINDINGS_FETCH: {
        cfApi.fetchServiceBindings(action.appGuid);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BINDINGS_RECEIVED: {
        const bindings = this.formatSplitResponse(action.serviceBindings);
        this.mergeMany('guid', bindings, () => { });
        this.fetching = false;
        this.fetched = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BIND: {
        cfApi.createServiceBinding(action.appGuid, action.serviceInstanceGuid);
        break;
      }

      case serviceActionTypes.SERVICE_UNBIND: {
        cfApi.deleteServiceBinding(action.serviceBinding);
        break;
      }

      case serviceActionTypes.SERVICE_BOUND: {
        const binding = this.formatSplitResponse([action.serviceBinding]).pop();
        this.merge('guid', binding, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_UNBOUND: {
        const binding = this.get(action.serviceBinding.guid);
        if (binding) {
          this.delete(binding.guid, () => this.emitChange());
        }
        break;
      }

      default:
        break;
    }
  }
}

const _ServiceBindingStore = new ServiceBindingStore();

export default _ServiceBindingStore;
