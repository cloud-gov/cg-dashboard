
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

  parseAllJson(entities, key) {
    const e = entities.slice();
    return e.map((entity) => this.parseJson(entity, key));
  }

  parseJson(entity, key) {
    const parsed = {};
    if (entity[key]) {
      parsed[key] = JSON.parse(entity[key]);
    }
    return Object.assign({}, entity, parsed);
  }

  getCost(servicePlan) {
    return (servicePlan.extra &&
      servicePlan.extra.costs &&
      servicePlan.extra.costs[0].amount &&
      servicePlan.extra.costs[0].amount.usd || 0);
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICES_RECEIVED: {
        const services = this.formatSplitResponse(action.services);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        const planRequests = [];
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

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED: {
        const instances = this.formatSplitResponse(action.serviceInstances);
        this.fetched = false;
        this.fetching = true;
        this.emitChange();
        const planRequests = [];
        for (const instance of instances) {
          planRequests.push(cfApi.fetchServicePlan(instance.service_plan_guid));
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

      case serviceActionTypes.SERVICE_PLAN_RECEIVED: {
        const servicePlan = this.parseJson(
          this.formatSplitResponse([action.servicePlan])[0], 'extra');
        this.merge('guid', servicePlan, () => {
          this.emitChange();
        });
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_RECEIVED: {
        if (action.servicePlans) {
          let servicePlans = this.formatSplitResponse(action.servicePlans);
          servicePlans = this.parseAllJson(servicePlans, 'extra');

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
