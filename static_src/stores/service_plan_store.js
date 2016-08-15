
/*
 * Store for service plans data. Service plans belong to a service so there's
 * separate functionality to get all plans under a particiular service.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants.js';
import ServiceStore from './service_store.js';

class ServicePlanStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
    this.waitingOnRequests = false;
  }

  getAllFromService(serviceGuid) {
    const fromService = this._data.filter((servicePlan) =>
      servicePlan.get('service_guid') === serviceGuid
    );

    return fromService.toJS();
  }

  parseJson(entities, key) {
    const e = entities.slice();
    return e.map((entity) => {
      const parsed = {};
      if (entity[key]) {
        parsed[key] = JSON.parse(entity[key]);
      }
      return Object.assign({}, entity, parsed);
    });
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_RECEIVED: {
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        const services = this.formatSplitResponse(action.services);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        let planRequests = [];
        for (const service of services) {
          planRequests.push(cfApi.fetchAllServicePlans(service.guid));
        }
        if (planRequests.length) {
          this.waitingOnRequests = true;
          Promise.all(planRequests).then(() => {
            this.waitingOnRequests = false;
            this.fetching = false;
            this.fetched = true;
            this.emitChange();
          });
        }
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_FETCH: {
        this.fetching = true;
        this.fetched = false;
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        cfApi.fetchAllServicePlans(action.serviceGuid);
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_RECEIVED: {
        if (action.servicePlans) {
          let servicePlans = this.formatSplitResponse(action.servicePlans);
          servicePlans = this.parseJson(servicePlans, 'extra');

          if (!this.waitingOnRequests) {
            this.fetching = false;
            this.fetched = true;
          }

          this.mergeMany('guid', servicePlans, () => { });
          this.emitChange();
        }
        break;
      }

      default:
        break;

    }
  }
}

const _ServicePlanStore = new ServicePlanStore();

export default _ServicePlanStore;
