
/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { appStates, appActionTypes } from '../constants.js';


export class AppStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this._currentAppGuid = null;
    this._fetchAll = false;
    this._fetchApp = false;
    this._fetchAppStats = false;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  get loading() {
    return this._fetchAll || this._fetchApp || this._fetchAppStats;
  }

  isStarting(app) {
    return app.state === appStates.starting;
  }

  isRestarting(app) {
    return app.state === appStates.restarting;
  }

  isRunning(app) {
    return app.state === appStates.running || app.state === appStates.started;
  }

  isUpdating(app) {
    return !!app.updating;
  }

  _registerToActions(action) {
    switch (action.type) {
      case appActionTypes.APP_FETCH:
        this._fetchApp = true;
        this.emitChange();
        break;

      case appActionTypes.APP_UPDATE: {
        const existingApp = this.get(action.appGuid);
        const updatedApp = Object.assign({}, existingApp, { updating: true });
        this.merge('guid', updatedApp);
        break;
      }

      case appActionTypes.APP_UPDATED: {
        // Once the platform receives the update, it will restart the app
        // instances behind the scenes. Update the UI here to give the user a
        // clue that wheels are churning.
        const restartingApp = Object.assign({}, action.app, {
          updating: false,
          state: appStates.restarting
        });

        // Setup a poll so that we know when the app is back up.
        this.poll(
          (res) => res.data.running_instances > 0,
          cfApi.fetchAppStatus.bind(cfApi, restartingApp.guid)
        ).then((res) => {
          this.merge('guid', res.data);
        }).catch((error) => {
          const erroredApp = Object.assign({}, action.app, {
            error,
            state: appStates.unknown
          });

          this.merge('guid', erroredApp);
        });
        this.merge('guid', restartingApp);
        break;
      }

      case appActionTypes.APP_STATS_FETCH:
        this._fetchAppStats = true;
        this.emitChange();
        break;

      case appActionTypes.APP_RECEIVED:
        this._fetchApp = false;
        this.merge('guid', action.app, () => {
          // Emit regardless because the loading state has changed
          this.emitChange();
        });
        break;

      case appActionTypes.APP_STATS_RECEIVED: {
        this._fetchAppStats = false;
        const app = Object.assign({}, action.app, { guid: action.appGuid });
        this.merge('guid', app, () => {
          // Emit change regardless of app because loading state changed
          this.emitChange();
        });
        break;
      }

      case appActionTypes.APP_ALL_FETCH: {
        this._fetchAll = true;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_ALL_RECEIVED: {
        this._fetchAll = false;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_CHANGE_CURRENT: {
        this._currentAppGuid = action.appGuid;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_START: {
        const app = this.get(action.appGuid);
        if (app) {
          const startingApp = Object.assign({}, app,
            { state: appStates.starting });
          this.merge('guid', startingApp, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case appActionTypes.APP_RESTART: {
        const app = this.get(action.appGuid);
        if (app) {
          const restartingApp = Object.assign({}, app,
            { state: appStates.restarting });
          this.merge('guid', restartingApp, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case appActionTypes.APP_RESTARTED: {
        break;
      }

      case appActionTypes.APP_ERROR: {
        const app = this.get(action.appGuid);
        if (app) {
          const erroredApp = Object.assign({}, app, {
            error: action.error,
            updating: false,
            restarting: false
          });
          this.merge('guid', erroredApp);
          setTimeout(() => { cfApi.fetchAppAll(action.appGuid); }, 3000);
        }
        break;
      }

      default:
        break;
    }
  }

  get currentAppGuid() {
    return this._currentAppGuid;
  }
}

const _AppStore = new AppStore();

export default _AppStore;
