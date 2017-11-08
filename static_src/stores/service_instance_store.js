/*
 * Store for services data. Will store and update services data on changes from
 * UI and server.
 */
import AppDispatcher from "../dispatcher";
import BaseStore from "./base_store.js";
import {
  appStates,
  serviceActionTypes,
  errorActionTypes
} from "../constants.js";
import ServiceStore from "./service_store.js";
import ServicePlanStore from "./service_plan_store.js";

export const OPERATION_FAILED = "failed";
export const OPERATION_DELETING = "deleting";
const OPERATION_PROCESSING = "processing";
export const OPERATION_RUNNING = "running";
const OPERATION_INACTIVE = "inactive";
export const CREATED_NOTIFICATION_TIME_MS = 3000;

const OPERATION_STATES = {};
OPERATION_STATES[OPERATION_FAILED] = "Failed";
OPERATION_STATES[OPERATION_DELETING] = "Deleting";
OPERATION_STATES[OPERATION_PROCESSING] = "Reconfiguring";
OPERATION_STATES[OPERATION_RUNNING] = "Available";
OPERATION_STATES[OPERATION_INACTIVE] = "Stopped";

const APP_STATE_MAP = {
  [OPERATION_FAILED]: appStates.crashed,
  [OPERATION_DELETING]: appStates.stopped,
  [OPERATION_INACTIVE]: appStates.stopped,
  [OPERATION_PROCESSING]: appStates.running,
  [OPERATION_RUNNING]: appStates.running
};

const SERVICE_INSTANCE_CREATE_ERROR_MAP = {
  "CF-ServiceInstanceNameTaken":
    "The service instance name is taken. Please use a unique name.",
  "CF-ServiceInstanceInvalid": "Invalid space selected.",
  "CF-ServiceBrokerBadResponse":
    "This service instance must be created using the CF CLI." +
    " Please refer to https://cloud.gov/docs/services/ for more information.",
  "CF-MessageParseError": "One or more form fields are blank or invalid."
};

const BINDING_ERROR_MAP = {
  "CF-ServiceBindingAppServiceTaken":
    "Service instance already bound to the current app",
  "CF-BindingCannot": "Cannot bind service instance."
};

const getFriendlyError = (error, errorMap) => {
  const { code, error_code: errorCode } = error;

  if (errorCode in errorMap) {
    return errorMap[errorCode];
  }

  return `Error #${
    code
  }. Please contact cloud.gov support for help troubleshooting this issue.`;
};

export class ServiceInstanceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._createInstanceForm = null;
    this._createError = null;
    this._createLoading = false;
    this._createdTempNotification = false;
    this._fetchAll = false;
    this._fetching = false;
    this._updating = false;
  }

  get createInstanceForm() {
    return this._createInstanceForm;
  }

  get createError() {
    return this._createError;
  }

  get createLoading() {
    return this._createLoading;
  }

  get createdTempNotification() {
    return this._createdTempNotification;
  }

  get updating() {
    return this._updating;
  }

  get loading() {
    return this._fetchAll || this._fetching;
  }

  getAllBySpaceGuid(spaceGuid) {
    return this.getAll().filter(
      serviceInstance => serviceInstance.space_guid === spaceGuid
    );
  }

  getInstanceState(serviceInstance) {
    const lastOp = serviceInstance.last_operation;
    if (!lastOp) return OPERATION_RUNNING;

    if (lastOp.state === "failed") {
      return OPERATION_FAILED;
    }
    if (lastOp.type === "delete") {
      return OPERATION_DELETING;
    }
    if (lastOp.type === "update") {
      if (lastOp.state === "in progress") return OPERATION_PROCESSING;
    }
    return OPERATION_RUNNING;
  }

  getMappedAppState(serviceInstance) {
    const serviceState = this.getInstanceState(serviceInstance);
    return APP_STATE_MAP[serviceState];
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
    return serviceInstance.serviceBindings.find(
      serviceBinding => serviceBinding.app_guid === appGuid
    );
  }

  isInstanceBound(serviceInstance, serviceBindings) {
    if (!serviceInstance.serviceBindings.length) return false;
    let isBound = false;
    serviceInstance.serviceBindings.forEach(instanceBinding => {
      isBound = serviceBindings.find(
        serviceBinding => instanceBinding.guid === serviceBinding.guid
      );
    });

    return isBound;
  }

  _registerToActions(action) {
    switch (action.type) {
      case serviceActionTypes.SERVICE_INSTANCES_FETCH: {
        this._fetchAll = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_FETCH: {
        // TODO this isn't really correct, because if fetching multiple
        // instances they will clobber state. When fetching individual
        // entities, we should store the fetch state on the entity itself
        this._fetching = true;
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_RECEIVED: {
        this._fetching = false;
        const instance = action.serviceInstance;
        this.merge("guid", instance, () => {
          // Always emitchange as fetch state was changed.
          this.emitChange();
        });
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCES_RECEIVED: {
        this._fetchAll = false;
        const services = action.serviceInstances;
        this.mergeMany("guid", services, () => {
          // Always emitchange as fetch state was changed.
          this.emitChange();
        });
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM: {
        AppDispatcher.waitFor([ServiceStore.dispatchToken]);

        this._createInstanceForm = {
          error: null,
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
        this._createLoading = true;
        // TODO create a "creating" service instance in the UI to update later
        this.emitChange();
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CREATED: {
        this._createError = null;
        this._createLoading = false;
        this._createdTempNotification = true;
        this.emitChange();
        setTimeout(() => {
          this._createInstanceForm = null;
          this._createdTempNotification = false;
          this.emitChange();
        }, CREATED_NOTIFICATION_TIME_MS);
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR: {
        this._createInstanceForm = Object.assign(
          {},
          this._createInstanceForm || {},
          {
            error: {
              description: getFriendlyError(
                action.error,
                SERVICE_INSTANCE_CREATE_ERROR_MAP
              )
            }
          }
        );
        this._createLoading = false;

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
          this.merge("guid", toConfirm, changed => {
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
          this.merge("guid", toConfirm, changed => {
            if (changed) this.emitChange();
          });
        }

        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETE: {
        this._updating = true;
        const serviceInstance = this.get(action.serviceInstanceGuid);
        const toDelete = Object.assign({}, serviceInstance, { deleting: true });
        this.merge("guid", toDelete);
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_DELETED: {
        this._updating = false;
        this.delete(action.serviceInstanceGuid);
        break;
      }

      case serviceActionTypes.SERVICE_BIND: {
        const instance = this.get(action.serviceInstanceGuid);
        if (instance) {
          const newInstance = Object.assign({}, instance, {
            loading: "Binding"
          });
          this.merge("guid", newInstance, () => this.emitChange());
        }
        break;
      }

      case serviceActionTypes.SERVICE_UNBIND: {
        const instance = this.get(action.serviceBinding.service_instance_guid);
        if (instance) {
          const newInstance = Object.assign({}, instance, {
            loading: "Unbinding"
          });
          this.merge("guid", newInstance, () => this.emitChange());
        }
        break;
      }

      case serviceActionTypes.SERVICE_BOUND:
      case serviceActionTypes.SERVICE_UNBOUND: {
        let binding;
        if (action.type === serviceActionTypes.SERVICE_BOUND) {
          binding = action.serviceBinding;
        } else {
          binding = action.serviceBinding;
        }
        const instance = this.get(binding.service_instance_guid);
        if (!instance) break; // TODO throw error
        const updatedInstance = Object.assign({}, instance, {
          changing: false,
          error: false,
          loading: false
        });
        this.merge("guid", updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CHANGE_CHECK: {
        const instance = this.get(action.serviceInstanceGuid);
        if (!instance) break; // TODO throw error?
        const updatedInstance = Object.assign({}, instance, {
          changing: true
        });
        this.merge("guid", updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_CHANGE_CANCEL: {
        const instance = this.get(action.serviceInstanceGuid);
        if (!instance) break; // TODO throw error?
        const updatedInstance = Object.assign({}, instance, {
          changing: false
        });
        this.merge("guid", updatedInstance, () => this.emitChange());
        break;
      }

      case serviceActionTypes.SERVICE_INSTANCE_ERROR: {
        const instance = this.get(action.serviceInstanceGuid);

        if (!instance) {
          break;
        }

        const newInstance = Object.assign({}, instance, {
          error: {
            description: getFriendlyError(action.error, BINDING_ERROR_MAP)
          },
          loading: false
        });

        this.merge("guid", newInstance, changed => {
          if (changed) this.emitChange();
        });
        break;
      }

      case errorActionTypes.CLEAR: {
        const clearedInstances = this._data
          .filter(val => val.has("error"))
          .map(instance => instance.update("error", () => null));

        this._createError = null;
        this.mergeMany("guid", clearedInstances, () => {
          this.emitChange();
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

export { SERVICE_INSTANCE_CREATE_ERROR_MAP, BINDING_ERROR_MAP };
