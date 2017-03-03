
/*
 * Actions for app entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { appActionTypes } from '../constants';
import errorActions from './error_actions.js';
import cfApi from '../util/cf_api.js';
import poll from '../util/poll.js';

const appActions = {
  fetch(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_FETCH,
      appGuid
    });

    return cfApi.fetchApp(appGuid).then(appActions.receivedApp)
      .catch((err) => {
        errorActions.importantDataFetchError(
          err,
          'unable to fetch app'
        );
      });
  },

  receivedApp(app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RECEIVED,
      app
    });

    return Promise.resolve(app);
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
          appStatus => appStatus.running_instances > 0,
          // TODO if this was an action that updated the store, the UI would
          // give richer information from the poll
          cfApi.fetchAppStatus.bind(cfApi, app.guid)
        )
      ).then(appActions.updatedApp, (err) => appActions.error(appGuid, err));
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

    return cfApi.fetchAppStats(appGuid)
      .then(app => appActions.receivedAppStats(appGuid, app))
      .catch((err) => {
        appActions.fetchError(appGuid);
        return errorActions.importantDataFetchError(err,
          'app usage data may be incomplete');
      });
  },

  receivedAppStats(appGuid, app) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_STATS_RECEIVED,
      appGuid,
      app
    });

    return Promise.resolve(app);
  },

  fetchAll(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_ALL_FETCH,
      appGuid
    });

    return cfApi.fetchAppAll(appGuid).then(() => appActions.receivedAppAll(appGuid));
  },

  receivedAppAll(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_ALL_RECEIVED,
      appGuid
    });

    return Promise.resolve(appGuid);
  },

  changeCurrentApp(appGuid) {
    AppDispatcher.handleUIAction({
      type: appActionTypes.APP_CHANGE_CURRENT,
      appGuid
    });

    return Promise.resolve(appGuid);
  },

  start(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_START,
      appGuid
    });

    return cfApi.putApp(appGuid, { state: 'STARTED' })
      .then(() => appActions.restarted(appGuid))
      .catch(err => appActions.error(appGuid, err));
  },

  restart(appGuid) {
    AppDispatcher.handleViewAction({
      type: appActionTypes.APP_RESTART,
      appGuid
    });

    return cfApi.postAppRestart(appGuid)
      .then(() =>
        poll(
          (app) => app.running_instances > 0,
          cfApi.fetchAppStatus.bind(cfApi, appGuid)
        ).then((app) =>
          Promise.all([
            appActions.fetchStats(appGuid),
            appActions.receivedApp(app)
          ])
        )
      ).then(() => appActions.restarted(appGuid));
  },

  restarted(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_RESTARTED,
      appGuid
    });

    return Promise.resolve();
  },

  error(appGuid, err) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_ERROR,
      appGuid,
      error: err
    });

    // TODO Not sure if this should return null or reject
    return Promise.reject(err);
  },

  fetchError(appGuid) {
    AppDispatcher.handleServerAction({
      type: appActionTypes.APP_FETCH_ERROR,
      appGuid
    });

    return Promise.resolve(appGuid);
  }
};

export default appActions;
