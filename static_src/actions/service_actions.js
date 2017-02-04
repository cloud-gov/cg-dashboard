
/*
 * Actions for service entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants';
import ServiceInstanceStore from '../stores/service_instance_store';

const serviceActions = {
  fetchAllServices(orgGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICES_FETCH,
      orgGuid
    });

    return cfApi.fetchAllServices(orgGuid)
      .then(services =>
        // Fetch associated service plans
        Promise.all(services.map(service => serviceActions.fetchAllPlans(service.guid)))
          .then(() => services)
      );
  },

  receivedServices(services) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICES_RECEIVED,
      services
    });
  },

  fetchPlan(servicePlanGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLAN_FETCH,
      servicePlanGuid
    });

    return cfApi.fetchServicePlan(servicePlanGuid);
  },

  receivedPlan(servicePlan) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLAN_RECEIVED,
      servicePlan
    });
  },

  fetchAllPlans(serviceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_PLANS_FETCH,
      serviceGuid
    });

    return cfApi.fetchAllServicePlans(serviceGuid);
  },

  receivedPlans(servicePlans) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLANS_RECEIVED,
      servicePlans
    });
  },

  fetchAllInstances(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCES_FETCH,
      spaceGuid
    });

    return cfApi.fetchServiceInstances(spaceGuid)
      .then(serviceInstances =>
         Promise.all(serviceInstances.map(
           serviceInstance => serviceActions.fetchPlan(serviceInstance.service_plan_guid)
         ))
         .then(() => serviceInstances)
      );
  },

  createInstanceForm(serviceGuid, planGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
      serviceGuid,
      servicePlanGuid: planGuid
    });
  },

  createInstanceFormCancel() {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM_CANCEL
    });
  },

  createInstance(name, spaceGuid, servicePlanGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE,
      name,
      spaceGuid,
      servicePlanGuid
    });

    return cfApi.createServiceInstance(name, spaceGuid, servicePlanGuid)
      .then(serviceInstance => serviceActions.fetchInstance(serviceInstance.guid));
  },

  createdInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATED,
      serviceInstance
    });
  },

  errorCreateInstance(err) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR,
      error: err
    });
  },

  fetchInstance(serviceInstanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_FETCH,
      serviceInstanceGuid
    });

    return cfApi.fetchServiceInstance(serviceInstanceGuid);
  },

  receivedInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_RECEIVED,
      serviceInstance
    });
  },

  receivedInstances(serviceInstances) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
      serviceInstances
    });
  },

  deleteInstanceConfirm(instanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM,
      serviceInstanceGuid: instanceGuid
    });
  },

  deleteInstanceCancel(instanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE_CANCEL,
      serviceInstanceGuid: instanceGuid
    });
  },

  deleteInstance(instanceGuid) {
    const toDelete = ServiceInstanceStore.get(instanceGuid);
    if (!toDelete) {
      return Promise.reject(new Error(`ServiceInstance ${instanceGuid} is not in store`));
    }

    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
      serviceInstanceGuid: instanceGuid
    });

    return cfApi.deleteUnboundServiceInstance(toDelete);
  },

  deletedInstance(serviceInstanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
      serviceInstanceGuid
    });
  },

  changeServiceInstanceCheck(serviceInstanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CHANGE_CHECK,
      serviceInstanceGuid
    });
  },

  changeServiceInstanceCancel(serviceInstanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CHANGE_CANCEL,
      serviceInstanceGuid
    });
  },

  fetchServiceBindings(appGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_BINDINGS_FETCH,
      appGuid
    });
  },

  receivedServiceBindings(serviceBindings) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_BINDINGS_RECEIVED,
      serviceBindings
    });
  },

  bindService(appGuid, serviceInstanceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_BIND,
      appGuid,
      serviceInstanceGuid
    });
  },

  unbindService(serviceBinding) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_UNBIND,
      serviceBinding
    });
  },

  boundService(serviceBinding) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_BOUND,
      serviceBinding
    });
  },

  unboundService(serviceBinding) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_UNBOUND,
      serviceBinding
    });
  },

  instanceError(serviceInstanceGuid, error) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_ERROR,
      serviceInstanceGuid,
      error
    });
  }
};

export default serviceActions;
