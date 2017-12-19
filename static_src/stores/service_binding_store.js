/*
 * Store for service bindings data. Bindings are what link apps to service
 * instances.
 */

import BaseStore from "./base_store.js";
import { serviceActionTypes } from "../constants.js";

export class ServiceBindingStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this.handleAction.bind(this));
    this.isFetching = false;
  }

  get loading() {
    return this.isFetching;
  }

  getAllByApp(appGuid) {
    return this.getAll().filter(binding => binding.app_guid === appGuid);
  }

  handleAction(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_BINDINGS_FETCH: {
        this.isFetching = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BINDINGS_RECEIVED: {
        this.isFetching = false;
        const bindings = action.serviceBindings;
        this.mergeMany("guid", bindings, () => {});
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_BIND: {
        // TODO store the biding-in-progress state within a new serviceBinding
        break;
      }

      case serviceActionTypes.SERVICE_UNBIND: {
        const binding = this.get(action.serviceBinding.guid);
        const unbindingService = Object.assign({}, binding, {
          unbinding: true
        });
        this.merge("guid", unbindingService);
        break;
      }

      case serviceActionTypes.SERVICE_BOUND: {
        const binding = action.serviceBinding;
        this.merge("guid", binding);
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

export default new ServiceBindingStore();
