

import AppDispatcher from '../dispatcher.js';
import { activityActionTypes } from '../constants';
import cfApi from '../util/cf_api.js';

const activityActions = {
  fetchSpaceEvents(spaceGuid, appGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.EVENTS_FETCH,
      spaceGuid
    });

    return cfApi.fetchSpaceEvents(spaceGuid, { appGuid })
      .then(activityActions.receivedSpaceEvents);
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
      .then(logs => activityActions.receivedAppLogs(appGuid, logs))
      .catch(err => activityActions.errorAppLogs(appGuid, err));
  },

  receivedAppLogs(appGuid, logs) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.LOGS_RECEIVED,
      appGuid,
      logs
    });

    return Promise.resolve(logs);
  },

  errorAppLogs(appGuid, err) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.LOGS_ERROR,
      appGuid,
      err
    });

    return Promise.resolve();
  }
};

export default activityActions;
