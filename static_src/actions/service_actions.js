
/*
 * Actions for service entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

// TODO consider splitting this up into separate files for bind, instance, and
// plan actions similar to how stores are divided

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import errorActions from './error_actions.js';
import { serviceActionTypes } from '../constants';
import ServiceInstanceStore from '../stores/service_instance_store';

const formatError = error => {
  const { response } = error;

  return (response && response.data) || { code: 500 };
};

const serviceActions = {
  fetchAllServices(orgGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICES_FETCH,
      orgGuid
    });

    return cfApi.fetchAllServices(orgGuid)
      .then(services => {
        serviceActions.receivedServices(services);
        // Fetch associated service plans
        return Promise.all(services.map(service => serviceActions.fetchAllPlans(service.guid)))
          .then(() => services);
      })
      .catch((err) =>
        errorActions.importantDataFetchError(err, 'unable to fetch marketplace')
      );
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
      .then(serviceActions.receivedPlans)
      .catch((err) =>
        errorActions.importantDataFetchError(err, 'unable to fetch service plans')
      );
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
      .then(serviceInstances => {
        serviceActions.receivedInstances(serviceInstances);
        return Promise.all(serviceInstances.map(
           serviceInstance => serviceActions.fetchPlan(serviceInstance.service_plan_guid)
        ))
        .then(() => serviceInstances)
        .catch((err) => {
          errorActions.importantDataFetchError(err, 'unable to fetch service plans');
          // Still return completed service instances
          return serviceInstances;
        });
      })
      .catch((err) =>
        errorActions.importantDataFetchError(err, 'unable to fetch service instances')
      );
  },

  createInstanceForm(serviceGuid, planGuid) {
    return serviceActions.createInstanceFormCancel().then(() => {
      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
        serviceGuid,
        servicePlanGuid: planGuid
      });
    });
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
      .then(serviceActions.createdInstance)
      .catch(serviceActions.errorCreateInstance);
  },

  createdInstance(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATED,
      serviceInstance
    });

    return Promise.resolve(serviceInstance);
  },

  errorCreateInstance(error) {
    const safeError = formatError(error);

    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR,
      error: safeError
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
      .catch((error) => serviceActions.errorDeleteInstance(error, instanceGuid));
  },

  deletedInstance(serviceInstanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETED,
      serviceInstanceGuid
    });

    return Promise.resolve(serviceInstanceGuid);
  },

  errorDeleteInstance(error, instanceGuid) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_DELETE_ERROR,
      instanceGuid,
      error: formatError(error)
    });

    return Promise.resolve(instanceGuid);
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

    return cfApi.fetchServiceBindings(appGuid)
      .then(serviceActions.receivedServiceBindings)
      .catch((err) =>
        errorActions.importantDataFetchError(err, 'unable to fetch services')
      );
  },

  receivedServiceBindings(serviceBindings) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_BINDINGS_RECEIVED,
      serviceBindings
    });

    return Promise.resolve(serviceBindings);
  },

  bindService(appGuid, serviceInstanceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_BIND,
      appGuid,
      serviceInstanceGuid
    });

    return cfApi.createServiceBinding(appGuid, serviceInstanceGuid)
      .then(serviceActions.boundService)
      .catch(err => serviceActions.instanceError(serviceInstanceGuid, err));
  },

  unbindService(serviceBinding) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_UNBIND,
      serviceBinding
    });

    return cfApi.deleteServiceBinding(serviceBinding)
      .then(() => serviceActions.unboundService(serviceBinding))
      .catch(err => serviceActions.instanceError(serviceBinding.service_instance_guid, err));
  },

  boundService(serviceBinding) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_BOUND,
      serviceBinding
    });

    return Promise.resolve(serviceBinding);
  },

  unboundService(serviceBinding) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_UNBOUND,
      serviceBinding
    });

    return Promise.resolve(serviceBinding);
  },

  instanceError(serviceInstanceGuid, error) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCE_ERROR,
      serviceInstanceGuid,
      error: formatError(error)
    });

    return Promise.resolve();
  }
};

export default serviceActions;
