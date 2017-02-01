
/*
 * Actions for app entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { appActionTypes } from '../constants';
import cfApi from '../util/cf_api.js';
import poll from '../util/poll.js';

export default {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_FETCH,
      appGuid
    });

    return cfApi.fetchApp(appGuid);
  },

  receivedApp(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RECEIVED,
      app
    });
  },

  updateApp(appGuid, appPartial) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_UPDATE,
      appPartial,
      appGuid
    });

    return cfApi.putApp(appGuid, appPartial)
      .then((app) =>
        // Setup a poll so that we know when the app is back up.
        poll(
          (appStatus) => appStatus.running_instances > 0,
          cfApi.fetchAppStatus.bind(cfApi, app.guid)
        )
        .then(() => app) // Return the original result
      ).then(this.updatedApp, (err) => this.error(appGuid, err));
  },

  updatedApp(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_UPDATED,
      app
    });

    return Promise.resolve(app);
  },

  fetchStats(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_STATS_FETCH,
      appGuid
    });

    return cfApi.fetchAppStats(appGuid);
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

    return cfApi.fetchAppAll(appGuid);
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

  start(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_START,
      appGuid
    });

    return cfApi.putApp(appGuid, { state: 'STARTED' }).then(() =>
      this.restarted(appGuid));
  },

  restart(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_RESTART,
      appGuid
    });

    return cfApi.postAppRestart(appGuid).then(() => this.restarted(appGuid));
  },

  restarted(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RESTARTED,
      appGuid
    });

    return poll(
        (app) => app.running_instances > 0,
        cfApi.fetchAppStatus.bind(cfApi, appGuid)
      ).then((res) => {
        this.fetchStats(appGuid);
        this.receivedApp(res.data);
      });
  },

  error(appGuid, err) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_ERROR,
      appGuid,
      error: err
    });

    // TODO Not sure if this should return null or reject
    return Promise.reject(err);
  }
};
