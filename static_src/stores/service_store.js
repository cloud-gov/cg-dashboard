
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import { serviceActionTypes } from '../constants.js';
import ServicePlanStore from './service_plan_store.js';

export class ServiceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._fetchAll = false;
  }

  get loading() {
    return this._fetchAll;
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_FETCH: {
        this._fetchAll = true;
        break;
      }

      case serviceActionTypes.SERVICES_RECEIVED: {
        this._fetchAll = false;
        AppDispatcher.waitFor([ServicePlanStore.dispatchToken]);
        const services = action.services;
        this.mergeMany('guid', services, () => { } );
        this.emitChange();
        break;
      }

      default:
        break;

    }
  }
}

const _ServiceStore = new ServiceStore();

export default _ServiceStore;
