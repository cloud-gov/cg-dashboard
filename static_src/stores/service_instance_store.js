
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

const OPERATION_STATES = {
  failed: 'Failed',
  deleting: 'Deleting',
  processing: 'In progress',
  running: 'Running',
  inactive: 'Stopped'
};

class ServiceInstanceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._data = new Immutable.List();
    this._createInstanceForm = null;
    this._createError = null;
    this.waitingOnRequests = false;
  }

  get createInstanceForm() {
    return this._createInstanceForm;
  }

  get createError() {
    return this._createError;
  }

  getAllBySpaceGuid(spaceGuid) {
    return this.getAll().filter((serviceInstance) =>
      serviceInstance.space_guid === spaceGuid);
  }

  getInstanceState(serviceInstance) {
    const lastOp = serviceInstance.last_operation;
    if (!lastOp) return 'running';

    if (lastOp.state === 'failed') {
      return 'failed';
    }
    if (lastOp.type === 'delete') {
      return 'deleting';
    }
    return 'running';
  }

  getInstanceReadableState(serviceInstance) {
    if (!serviceInstance.last_operation) return OPERATION_STATES.running;
    let state = this.getInstanceState(serviceInstance);
    if (state === 'failed') {
      state = `serviceInstance.last_operation.type ${OPERATION_STATES[state]}`;
    }
    return OPERATION_STATES[state];
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_INSTANCES_FETCH: {
        this.fetching = true;
        this.fetched = false;
        cfApi.fetchServiceInstances(action.spaceGuid);
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_RECEIVED: {
        const instance = this.formatSplitResponse(
          [action.serviceInstance])[0];

        if (!this.waitingOnRequests) {
          this.fetching = false;
          this.fetched = true;
        }

        this.merge('guid', instance, () => { });
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED: {
        const services = this.formatSplitResponse(action.serviceInstances);
        this.mergeMany('guid', services, () => { });
        this.fetching = false;
        this.fetched = true;
        this.emitChange();
        break;
      }

      /*
      case serviceActionTypes.SERVICE_BINDINGS_RECEIVED: {
        const bindings = this.formatSplitResponse(action.serviceBindings);
        this.fetching = true;
        this.fetched = false;
        this.emitChange();
        const instanceRequests = [];
        for (const binding of bindings) {
          instanceRequests.push(cfApi.fetchServiceInstance(
            binding.service_instance_guid));
        }
        if (instanceRequests.length) {
          this.waitingOnRequests = true;
          Promise.all(instanceRequests).then(() => {
            this.waitingOnRequests = false;
            this.fetching = false;
            this.fetched = true;
            this.emitChange();
          });
        }
        break;
      }
      */

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM: {
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);
        this._createInstanceForm = {
          service: ServiceStore.get(action.serviceGuid),
          servicePlan: ServicePlanStore.get(action.servicePlanGuid)
        };
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM_CANCEL:
        this._createInstanceForm = null;
        this.emitChange();
        break;

      case serviceActionTypes.SERVICE_INSTANCE_CREATE: {
        cfApi.createServiceInstance(
          action.name,
          action.spaceGuid,
          action.servicePlanGuid
        );
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CREATED: {
        cfApi.fetchServiceInstance(action.serviceInstance.metadata.guid);
        this._createInstanceForm = null;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_ERROR: {
        this._createError = action.error;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM: {
        const exists = this.get(action.serviceInstanceGuid);
        if (exists) {
          const toConfirm = {
            guid: action.serviceInstanceGuid,
            confirmDelete: true
          };
          this.merge('guid', toConfirm, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETE_CANCEL: {
        const exists = this.get(action.serviceInstanceGuid);
        if (exists) {
          const toConfirm = {
            guid: action.serviceInstanceGuid,
            confirmDelete: false
          };
          this.merge('guid', toConfirm, (changed) => {
            if (changed) this.emitChange();
          });
        }

        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETE: {
        const toDelete = this.get(action.serviceInstanceGuid);
        if (toDelete) {
          cfApi.deleteUnboundServiceInstance(toDelete);
        }
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETED: {
        this.delete(action.serviceInstanceGuid, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;

    }
  }
}

const _ServiceInstanceStore = new ServiceInstanceStore();

_ServiceInstanceStore.OPERATION_STATES = OPERATION_STATES;

export default _ServiceInstanceStore;
