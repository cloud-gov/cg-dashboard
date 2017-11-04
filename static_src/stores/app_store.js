
/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import BaseStore from './base_store.js';
import { appStates, appActionTypes } from '../constants.js';

export const appPropType = PropTypes.shape({
  guid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updating: PropTypes.bool,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      guid: PropTypes.string.isRequired
    })
  ).isRequired
});

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
        const updatedApp = Object.assign({}, existingApp, { updating: true, ...action.appPartial });
        this.merge('guid', updatedApp);
        break;
      }

      case appActionTypes.APP_UPDATED: {
        const app = Object.assign({}, action.app, {
          updating: false
        });

        this.merge('guid', app);
        break;
      }

      case appActionTypes.APP_STATS_FETCH:
        this._fetchAppStats = true;
        this.emitChange();
        break;

      case appActionTypes.APP_RECEIVED:
        this._fetchApp = false;
        this.merge('guid', action.app || {}, () => {
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

      case appActionTypes.APP_FETCH_ERROR: {
        this._fetchAll = false;
        this._fetchApp = false;
        this._fetchAppStats = false;
        this.emitChange();
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
