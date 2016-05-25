
/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */
import Immutable from 'immutable';

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

    this._data = Immutable.List();
    this._createInstanceForm = null;
    this._createError = null;
  }

  get createInstanceForm() {
    return this._createInstanceForm;
  }

  get createError() {
    return this._createError;
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_INSTANCES_FETCH:
        cfApi.fetchServiceInstances(action.spaceGuid);
        break;

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED:
        var services = this.formatSplitResponse(action.serviceInstances);
        this._data = Immutable.fromJS(services);
        this.emitChange();
        break;

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM:
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
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
        this.merge('guid', action.serviceInstance, (changed) => {
          if (!changed) return;

          this._createInstanceForm = null;
          this.emitChange();
        });
        break;

      case serviceActionTypes.SERVICE_INSTANCE_ERROR:

        this._createError = action.error;
        this.emitChange();
        break;

      case serviceActionTypes.SERVICE_INSTANCE_DELETE:
        var toDelete = this.get(action.serviceInstanceGuid);
        if (toDelete) {
          cfApi.deleteUnboundServiceInstance(toDelete);
        }
        break;

      case serviceActionTypes.SERVICE_INSTANCE_DELETED:
        let index = this._data.findIndex((d) => {
          return d.get('guid') === action.serviceInstanceGuid;
        });

        if (index > -1) {
          this._data = this._data.delete(index);
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
