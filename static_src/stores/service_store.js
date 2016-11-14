
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';
import ServicePlanStore from './service_plan_store.js';

class ServiceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_FETCH: {
        this.load([cfApi.fetchAllServices(action.orgGuid)]);
        break;
      }

      case serviceActionTypes.SERVICES_RECEIVED: {
        AppDispatcher.waitFor([ServicePlanStore.dispatchToken]);
        const services = action.services;
        this.mergeMany('guid', services, () => { });
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
