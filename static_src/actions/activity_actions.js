

import AppDispatcher from '../dispatcher.js';
import { activityActionTypes } from '../constants';

export default {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.ACTIVITY_FETCH,
      appGuid
    });
  },

  fetchSpaceActivity(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: activityActionTypes.ACTIVITY_FETCH,
      spaceGuid
    });
  },

  receivedActivity(activity) {
    AppDispatcher.handleServerAction({
      type: activityActionTypes.ACTIVITY_RECEIVED,
      activity
    });
  }
};
