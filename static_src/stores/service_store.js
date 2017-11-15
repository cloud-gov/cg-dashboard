/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import AppDispatcher from "../dispatcher";
import BaseStore from "./base_store.js";
import { serviceActionTypes } from "../constants.js";
import ServicePlanStore from "./service_plan_store.js";

export class ServiceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this.handleAction.bind(this));
    this.isFetchingAll = false;
  }

  get loading() {
    return this.isFetchingAll;
  }

  handleAction(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_FETCH: {
        this.isFetchingAll = true;
        break;
      }

      case serviceActionTypes.SERVICES_RECEIVED: {
        this.isFetchingAll = false;
        AppDispatcher.waitFor([ServicePlanStore.dispatchToken]);
        const services = action.services;
        this.mergeMany("guid", services, () => {
          // Always emitchange as fetch state was changed.
          this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }
}

export default new ServiceStore();
