
import AppDispatcher from '../dispatcher.js';
import { appActionTypes } from '../constants';

export default {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_FETCH,
      appGuid: appGuid
    });
  },

  received(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RECEIVED,
      app: app
    });
  }
};
