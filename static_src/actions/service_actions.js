
/*
 * Actions for service entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { serviceActionTypes } from '../constants';

export default {
  fetchAllServices(orgGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICES_FETCH,
      orgGuid
    });

    return cfApi.fetchAllServices(orgGuid);
  },

  receivedServices(services) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICES_RECEIVED,
      services
    });
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
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE,
      serviceInstanceGuid: instanceGuid
    });
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
