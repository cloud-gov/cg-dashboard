
import AppDispatcher from '../dispatcher.js';
import { serviceActionTypes } from '../constants';

export default {
  fetchAllInstances(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: serviceActionTypes.SERVICE_INSTANCES_FETCH,
      spaceGuid: spaceGuid
    });
  },

  receivedInstances(serviceInstance) {
    AppDispatcher.handleServerAction({
      type: serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
      serviceInstance: serviceInstance
    });
  }

};
