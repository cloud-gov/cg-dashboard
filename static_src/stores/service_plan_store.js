/*
 * Store for service plans data. Service plans belong to a service so there's
 * separate functionality to get all plans under a particiular service.
 */

import AppDispatcher from "../dispatcher";
import BaseStore from "./base_store.js";
import { serviceActionTypes } from "../constants.js";
import ServiceStore from "./service_store.js";

export class ServicePlanStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._fetchAll = false;
  }

  get loading() {
    return this._fetchAll;
  }

  getAllFromService(serviceGuid) {
    const fromService = this._data.filter(
      servicePlan => servicePlan.get("service_guid") === serviceGuid
    );

    return fromService.toJS();
  }

  getCost(servicePlan) {
    return (
      (servicePlan.extra &&
        servicePlan.extra.costs &&
        servicePlan.extra.costs[0].amount &&
        servicePlan.extra.costs[0].amount.usd) ||
      0
    );
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_PLAN_FETCH: {
        const servicePlan = this.get(action.servicePlanGuid) || {};
        const servicePlanFetching = Object.assign({}, servicePlan, {
          fetching: true
        });
        this.merge("guid", servicePlanFetching);
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_FETCH: {
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        this._fetchAll = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_PLAN_RECEIVED: {
        const servicePlan = action.servicePlan;
        const servicePlanReceived = Object.assign({}, servicePlan, {
          fetching: false
        });
        this.merge("guid", servicePlanReceived);
        break;
      }

      case serviceActionTypes.SERVICE_PLANS_RECEIVED: {
        this._fetchAll = false;
        if (action.servicePlans) {
          const servicePlans = action.servicePlans;
          this.mergeMany("guid", servicePlans, () => {});
        }
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
}

const _ServicePlanStore = new ServicePlanStore();

export default _ServicePlanStore;
