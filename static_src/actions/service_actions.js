
/*
 * Actions for service entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

// TODO consider splitting this up into separate files for bind, instance, and
// plan actions similar to how stores are divided

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
      )
      .then(serviceActions.receivedServices);
  },

  receivedServices(services) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICES_RECEIVED,
      services
    });

    return Promise.resolve(services);
  },

  fetchPlan(servicePlanGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLAN_FETCH,
      servicePlanGuid
    });

    return cfApi.fetchServicePlan(servicePlanGuid)
      .then(serviceActions.receivedPlan);
  },

  receivedPlan(servicePlan) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLAN_RECEIVED,
      servicePlan
    });

    return Promise.resolve(servicePlan);
  },

  fetchAllPlans(serviceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_PLANS_FETCH,
      serviceGuid
    });

    return cfApi.fetchAllServicePlans(serviceGuid)
      .then(serviceActions.receivedPlans);
  },

  receivedPlans(servicePlans) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLANS_RECEIVED,
      servicePlans
    });

    return Promise.resolve(servicePlans);
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
      )
      .then(serviceActions.receivedInstances);
  },

  createInstanceForm(serviceGuid, planGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
      serviceGuid,
      servicePlanGuid: planGuid
    });

    return Promise.resolve();
  },

  createInstanceFormCancel() {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM_CANCEL
    });

    return Promise.resolve();
  },

  createInstance(name, spaceGuid, servicePlanGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE,
      name,
      spaceGuid,
      servicePlanGuid
    });

    return cfApi.createServiceInstance(name, spaceGuid, servicePlanGuid)
      .then(serviceInstance => serviceActions.fetchInstance(serviceInstance.guid))
      .then(serviceActions.createdInstance, serviceActions.errorCreateInstance);
  },

  createdInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATED,
      serviceInstance
    });

    return Promise.resolve(serviceInstance);
  },

  errorCreateInstance(err) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR,
      error: err
    });

    return Promise.resolve();
  },

  fetchInstance(serviceInstanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_FETCH,
      serviceInstanceGuid
    });

    return cfApi.fetchServiceInstance(serviceInstanceGuid)
      .then(serviceActions.receivedInstance);
  },

  receivedInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_RECEIVED,
      serviceInstance
    });

    return Promise.resolve(serviceInstance);
  },

  receivedInstances(serviceInstances) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
      serviceInstances
    });

    return Promise.resolve(serviceInstances);
  },

  deleteInstanceConfirm(instanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM,
      serviceInstanceGuid: instanceGuid
    });

    return Promise.resolve();
  },

  deleteInstanceCancel(instanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE_CANCEL,
      serviceInstanceGuid: instanceGuid
    });

    return Promise.resolve(instanceGuid);
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

    return cfApi.deleteUnboundServiceInstance(toDelete)
      .then(() => serviceActions.deletedInstance(instanceGuid))
      // TODO if the delete fails, we want to expose it to the user
      .catch(() => serviceActions.deletedInstance(instanceGuid)); // Swallow the error
  },

  deletedInstance(serviceInstanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
      serviceInstanceGuid
    });

    return Promise.resolve(serviceInstanceGuid);
  },

  changeServiceInstanceCheck(serviceInstanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CHANGE_CHECK,
      serviceInstanceGuid
    });

    return Promise.resolve(serviceInstanceGuid);
  },

  changeServiceInstanceCancel(serviceInstanceGuid) {
    AppDispatcher.handleUIAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CHANGE_CANCEL,
      serviceInstanceGuid
    });

    return Promise.resolve(serviceInstanceGuid);
  },

  fetchServiceBindings(appGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_BINDINGS_FETCH,
      appGuid
    });

    return cfApi.fetchServiceBindings(appGuid);
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

    return cfApi.createServiceBinding(appGuid, serviceInstanceGuid);
  },

  unbindService(serviceBinding) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_UNBIND,
      serviceBinding
    });

    return cfApi.deleteServiceBinding(serviceBinding);
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

    return Promise.resolve();
  }
};

export default serviceActions;
