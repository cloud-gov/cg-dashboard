
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';
import ServiceStore from './service_store.js';
import ServicePlanStore from './service_plan_store.js';

class ServiceInstanceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
    this._createInstanceForm = null;
  }

  get createInstanceForm() {
    return this._createInstanceForm;
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

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_DIALOG:
        this._createInstanceForm = {
          service: ServiceStore.get(action.serviceGuid),
          servicePlan: ServicePlanStore.get(action.servicePlanGuid)
        };
        this.emitChange();
        break;

      case serviceActionTypes.SERVICE_INSTANCE_CREATE:
        cfApi.createServiceInstance(
          action.name,
          action.spaceGuid,
          action.servicePlanGuid
        );
        break;

      case serviceActionTypes.SERVICE_INSTANCE_CREATED:
        var existing = this.get(action.serviceInstance.guid);
        if (existing) {
          //this.update
          existing = Object.assign(existing, action.serviceInstance);

        } else {
          this._data.push(action.serviceInstance);
        }
        this._createInstanceForm = null;
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
