

import AppDispatcher from '../dispatcher.js';
import { activityActionTypes } from '../constants';
import cfApi from '../util/cf_api.js';

const activityActions = {
  fetchSpaceEvents(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.EVENTS_FETCH,
      spaceGuid
    });

    return cfApi.fetchSpaceEvents(spaceGuid).then(activityActions.receivedSpaceEvents);
  },

  receivedSpaceEvents(events) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.EVENTS_RECEIVED,
      events
    });

    return Promise.resolve(events);
  },

  fetchAppLogs(appGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.LOGS_FETCH,
      appGuid
    });

    return cfApi.fetchAppLogs(appGuid)
      .then(logs => activityActions.receivedAppLogs(appGuid, logs));
  },

  receivedAppLogs(appGuid, logs) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.LOGS_RECEIVED,
      appGuid,
      logs
    });

    return Promise.resolve(logs);
  }
};

export default activityActions;
