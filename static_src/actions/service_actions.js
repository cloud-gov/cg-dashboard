
/*
 * Actions for service entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

// TODO I'm still unsure of how to model services vs service entities.

import AppDispatcher from '../dispatcher.js';
import { serviceActionTypes } from '../constants';

export default {
  fetchAllServices(orgGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICES_FETCH,
      orgGuid: orgGuid
    });
  },

  receivedServices(services) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICES_RECEIVED,
      services: services
    });
  },

  fetchAllPlans(serviceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_PLANS_FETCH,
      serviceGuid: serviceGuid
    });
  },

  receivedPlans(servicePlans) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_PLANS_RECEIVED,
      servicePlans: servicePlans
    });
  },

  fetchAllInstances(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCES_FETCH,
      spaceGuid: spaceGuid
    });
  },

  createInstanceForm(serviceGuid, planGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
      serviceGuid: serviceGuid,
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
      name: name,
      spaceGuid: spaceGuid,
      servicePlanGuid: servicePlanGuid
    });
  },

  createdInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATED,
      serviceInstance: serviceInstance
    });
  },

  errorCreateInstance(err) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_ERROR,
      error: err
    });
  },

  receivedInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_RECEIVED,
      serviceInstance: serviceInstance
    });
  },

  receivedInstances(serviceInstances) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
      serviceInstances: serviceInstances
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
      serviceInstanceGuid: serviceInstanceGuid
    });
  }
};
