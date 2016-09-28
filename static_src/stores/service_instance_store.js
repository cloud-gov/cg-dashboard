
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

const OPERATION_FAILED = 'failed';
const OPERATION_DELETING = 'deleting';
const OPERATION_PROCESSING = 'processing';
const OPERATION_RUNNING = 'running';
const OPERATION_INACTIVE = 'inactive';

const OPERATION_STATES = {};
OPERATION_STATES[OPERATION_FAILED] = 'Failed';
OPERATION_STATES[OPERATION_DELETING] = 'Deleting';
OPERATION_STATES[OPERATION_PROCESSING] = 'In progress';
OPERATION_STATES[OPERATION_RUNNING] = 'Running';
OPERATION_STATES[OPERATION_INACTIVE] = 'Stopped';

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
    if (!lastOp) return OPERATION_RUNNING;

    if (lastOp.state === 'failed') {
      return OPERATION_FAILED;
    }
    if (lastOp.type === 'delete') {
      return OPERATION_DELETING;
    }
    return OPERATION_RUNNING;
  }

  getInstanceReadableState(serviceInstance) {
    if (!serviceInstance.last_operation) return OPERATION_STATES.running;
    let state = this.getInstanceState(serviceInstance);
    if (state === OPERATION_FAILED) {
      state = `serviceInstance.last_operation.type ${OPERATION_STATES[state]}`;
    }
    return OPERATION_STATES[state];
  }

  getServiceBindingForApp(appGuid, serviceInstance) {
    if (!serviceInstance.serviceBindings.length) return null;
    return serviceInstance.serviceBindings.find((serviceBinding) =>
      serviceBinding.app_guid === appGuid
    );
  }

  isInstanceBound(serviceInstance, serviceBindings) {
    if (!serviceInstance.serviceBindings.length) return false;
    let isBound = false;
    serviceInstance.serviceBindings.forEach((instanceBinding) => {
      isBound = serviceBindings.find((serviceBinding) =>
        instanceBinding.guid === serviceBinding.guid
      );
    });

    return isBound;
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

        this.merge('guid', instance, () => {
          this.emitChange();
        });
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED: {
        const services = this.formatSplitResponse(action.serviceInstances);
        this.mergeMany('guid', services, () => {
          this.fetching = false;
          this.fetched = true;
          this.emitChange();
        });
        break;
      }

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

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR: {
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

      case serviceActionTypes.SERVICE_BOUND:
      case serviceActionTypes.SERVICE_UNBOUND: {
        let binding;
        if (action.type === serviceActionTypes.SERVICE_BOUND) {
          binding = this.formatSplitResponse([action.serviceBinding]).pop();
        } else {
          binding = action.serviceBinding;
        }
        const instance = this.get(binding.service_instance_guid);
        if (!instance) break; // TODO throw error
        const updatedInstance = Object.assign({}, instance, {
          changing: false,
          error: false
        });
        this.merge('guid', updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CHANGE_CHECK: {
        const instance = this.get(action.serviceInstanceGuid);
        if (!instance) break; // TODO throw error?
        const updatedInstance = Object.assign({}, instance, {
          changing: true
        });
        this.merge('guid', updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CHANGE_CANCEL: {
        const instance = this.get(action.serviceInstanceGuid);
        if (!instance) break; // TODO throw error?
        const updatedInstance = Object.assign({}, instance, {
          changing: false
        });
        this.merge('guid', updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_ERROR: {
        const instance = this.get(action.serviceInstanceGuid);
        if (!instance) break;
        const newInstance = Object.assign({}, instance, {error: action.error});
        this.merge('guid', newInstance, (changed) => {
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
