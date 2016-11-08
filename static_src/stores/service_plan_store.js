
/*
 * Store for service plans data. Service plans belong to a service so there's
 * separate functionality to get all plans under a particiular service.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import LoadingStatus from '../util/loading_status.js';
import { serviceActionTypes } from '../constants.js';
import ServiceStore from './service_store.js';

class ServicePlanStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
    this.loadingStatus = new LoadingStatus();
    this.loadingStatus.on('loading', () => this.emitChange());
    this.loadingStatus.on('loaded', () => this.emitChange());
  }

  get loading() {
    return !this.loadingStatus.isLoaded;
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
        const services = action.services;
        this.loadingStatus.load(services.map(service => cfApi.fetchAllServicePlans(service.guid)));
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED: {
        const instances = action.serviceInstances;
        this.loadingStatus.load(instances.map(instance =>
          cfApi.fetchServicePlan(instance.service_plan_guid)));
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_FETCH: {
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        cfApi.fetchAllServicePlans(action.serviceGuid);
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_PLAN_RECEIVED: {
        const servicePlan = this.parseJson(
          action.servicePlan, 'extra');
        this.merge('guid', servicePlan, () => {
          this.emitChange();
        });
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_RECEIVED: {
        if (action.servicePlans) {
          let servicePlans = action.servicePlans;
          servicePlans = this.parseAllJson(servicePlans, 'extra');
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
