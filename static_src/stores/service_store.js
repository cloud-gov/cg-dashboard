
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';

class ServiceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_FETCH: {
        cfApi.fetchAllServices(action.orgGuid);
        break;
      }

      case serviceActionTypes.SERVICES_RECEIVED: {
        const services = this.formatSplitResponse(action.services);
        const immutableServices = Immutable.fromJS(services);

        if (this.dataHasChanged(immutableServices)) {
          this._data = immutableServices;
          this.emitChange();
        }
        break;
      }

      default:
        break;

    }
  }
}

const _ServiceStore = new ServiceStore();

export default _ServiceStore;
