

import AppDispatcher from '../dispatcher.js';
import { activityActionTypes } from '../constants';

export default {
  fetchSpaceEvents(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.EVENTS_FETCH,
      spaceGuid
    });
  },

  receivedSpaceEvents(events) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.EVENTS_RECEIVED,
      events
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
