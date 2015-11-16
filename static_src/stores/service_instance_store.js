
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';

class ServiceInstanceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_INSTANCES_FETCH:
        cfApi.fetchServiceInstances(action.spaceGuid);
        break;

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED:
        var services = this.formatSplitResponse(action.serviceInstances);
        this._data = services;
        this.emitChange();
        break;

      case serviceActionTypes.SERVICE_INSTANCE_DELETE:
        var toDelete = this.get(action.serviceInstanceGuid);
        if (toDelete) {
          cfApi.deleteUnboundServiceInstance(toDelete);
        }
        break;

      case serviceActionTypes.SERVICE_INSTANCE_DELETED:
        var deleted = this.get(action.serviceInstanceGuid);
        if (deleted) {
          var index = this._data.indexOf(deleted);
          this._data.splice(index, 1);
          this.emitChange();
        }
        break;

      default:
        break;

    }
  }

};
let _ServiceInstanceStore = new ServiceInstanceStore();

export default _ServiceInstanceStore;
