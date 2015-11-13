
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';

class ServiceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_FETCH:
        cfApi.fetchAllServices(action.orgGuid);
        break;

      case serviceActionTypes.SERVICES_RECEIVED:
        this._data = action.services;
        this.emitChange();
        break;

      default:
        break;

    }
  }

};
let _ServiceStore = new ServiceStore();

export default _ServiceStore;
