

import AppDispatcher from '../dispatcher.js';
import { activityActionTypes } from '../constants';

export default {
  // fetch(appGuid) {
  //   AppDispatcher.handleViewAction({
  //     type: activityActionTypes.EVENTS_FETCH,
  //     appGuid
  //   });
  // },

  fetchSpaceEvents(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.EVENTS_FETCH,
      spaceGuid
    });
  },

  receivedSpaceEvents(activity) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.EVENTS_RECEIVED,
      activity
    });
  },

  fetchAppLogs(appGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.LOGS_FETCH,
      appGuid
    });
  },

  receivedAppLogs(appGuid, logs) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.LOGS_RECEIVED,
      appGuid,
      logs
    });
  }
};
