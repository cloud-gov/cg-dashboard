
/*
 * Store for service plans data. Service plans belong to a service so there's
 * separate functionality to get all plans under a particiular service. 
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';
import ServiceStore from './service_store.js';

class ServicePlanStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  getAllFromService(serviceGuid) {
    return this._data.filter((servicePlan) => {
      return servicePlan.service_guid == serviceGuid;
    });
  }

  parseJson(entities, key) {
    return entities.map((entity) => {
      console.log('entity key', entity[key]);
      if (entity[key]) {
        entity[key] = JSON.parse(entity[key]);
      }
      return entity;
    });
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_PLANS_FETCH:
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        cfApi.fetchAllServicePlans(action.serviceGuid);
        break;

      case serviceActionTypes.SERVICE_PLANS_RECEIVED:
        if (action.servicePlans) {
          var servicePlans = this.formatSplitResponse(action.servicePlans);
          servicePlans = this.parseJson(servicePlans, 'extra')
          this._data = this._merge(this._data, servicePlans);
          this.emitChange();
        }
        break;

      default:
        break;

    }
  }

};
let _ServicePlanStore = new ServicePlanStore();

export default _ServicePlanStore;

