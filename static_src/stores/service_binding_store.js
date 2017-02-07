/*
 * Store for service bindings data. Bindings are what link apps to service
 * instances.
 */

import BaseStore from './base_store.js';
import { serviceActionTypes } from '../constants.js';

export class ServiceBindingStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._fetching = false;
  }

  get loading() {
    return this._fetching;
  }

  getAllByApp(appGuid) {
    return this.getAll().filter((binding) =>
      binding.app_guid === appGuid
    );
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_BINDINGS_FETCH: {
        this._fetching = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BINDINGS_RECEIVED: {
        this._fetching = false;
        const bindings = action.serviceBindings;
        this.mergeMany('guid', bindings, () => { });
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BIND: {
        // TODO store the biding-in-progress state within a new serviceBinding
        break;
      }

      case serviceActionTypes.SERVICE_UNBIND: {
        const binding = this.get(action.serviceBinding.guid);
        const unbindingService = Object.assign({}, binding, { unbinding: true });
        this.merge('guid', unbindingService);
        break;
      }

      case serviceActionTypes.SERVICE_BOUND: {
        const binding = action.serviceBinding;
        this.merge('guid', binding);
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
