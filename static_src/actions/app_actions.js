
/*
 * Actions for app entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { appActionTypes } from '../constants';

export default {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_FETCH,
      appGuid
    });
  },

  receivedApp(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RECEIVED,
      app
    });
  },

  fetchStats(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_STATS_FETCH,
      appGuid
    });
  },

  receivedAppStats(appGuid, app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_STATS_RECEIVED,
      appGuid,
      app
    });
  },

  fetchAll(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_ALL_FETCH,
      appGuid
    });
  },

  receivedAppAll(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_ALL_RECEIVED,
      appGuid
    });
  },

  changeCurrentApp(appGuid) {
    AppDispatcher.handleUIAction({
      type: appActionTypes.APP_CHANGE_CURRENT,
      appGuid
    });
  },

  restart(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_RESTART,
      appGuid
    });
  },

  restarted(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RESTARTED,
      appGuid
    });
  },

  error(appGuid, err) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_ERROR,
      appGuid,
      error: err
    });
  }
};
