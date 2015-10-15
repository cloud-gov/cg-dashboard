
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

  getAll() {
    return this._data;
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED:
        var updates = this._formatSplitRes(action.serviceInstances);
        this._data = updates;
        this.emitChange();
        break;

      default:
        break;

    }
  }

};
let _ServiceStore = new ServiceStore();

export default _ServiceStore;
