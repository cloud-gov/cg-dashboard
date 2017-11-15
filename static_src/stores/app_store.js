/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from "immutable";
import PropTypes from "prop-types";

import BaseStore from "./base_store.js";
import { appStates, appActionTypes } from "../constants.js";

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
    this.storeData = new Immutable.List();
    this.currentAppGuid = null;
    this.isFetchingAll = false;
    this.isFetchingApp = false;
    this.isFetchingAppStats = false;
    this.subscribe(() => this.handleAction.bind(this));
  }

  get loading() {
    return this.isFetchingAll || this.isFetchingApp || this.isFetchingAppStats;
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

  handleAction(action) {
    switch (action.type) {
      case appActionTypes.APP_FETCH:
        this.isFetchingApp = true;
        this.emitChange();
        break;

      case appActionTypes.APP_UPDATE: {
        const existingApp = this.get(action.appGuid);
        const updatedApp = Object.assign({}, existingApp, {
          updating: true,
          ...action.appPartial
        });
        this.merge("guid", updatedApp);
        break;
      }

      case appActionTypes.APP_UPDATED: {
        const app = Object.assign({}, action.app, {
          updating: false
        });

        this.merge("guid", app);
        break;
      }

      case appActionTypes.APP_STATS_FETCH:
        this.isFetchingAppStats = true;
        this.emitChange();
        break;

      case appActionTypes.APP_RECEIVED:
        this.isFetchingApp = false;
        this.merge("guid", action.app || {}, () => {
          // Emit regardless because the loading state has changed
          this.emitChange();
        });
        break;

      case appActionTypes.APP_STATS_RECEIVED: {
        this.isFetchingAppStats = false;
        const app = Object.assign({}, action.app, { guid: action.appGuid });
        this.merge("guid", app, () => {
          // Emit change regardless of app because loading state changed
          this.emitChange();
        });
        break;
      }

      case appActionTypes.APP_ALL_FETCH: {
        this.isFetchingAll = true;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_ALL_RECEIVED: {
        this.isFetchingAll = false;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_CHANGE_CURRENT: {
        this.currentAppGuid = action.appGuid;
        this.emitChange();
        break;
      }

      case appActionTypes.APP_START: {
        const app = this.get(action.appGuid);
        if (app) {
          const startingApp = Object.assign({}, app, {
            state: appStates.starting
          });
          this.merge("guid", startingApp, changed => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case appActionTypes.APP_RESTART: {
        const app = this.get(action.appGuid);
        if (app) {
          const restartingApp = Object.assign({}, app, {
            state: appStates.restarting
          });
          this.merge("guid", restartingApp, changed => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case appActionTypes.APP_RESTARTED: {
        break;
      }

      case appActionTypes.APP_FETCH_ERROR: {
        this.isFetchingAll = false;
        this.isFetchingApp = false;
        this.isFetchingAppStats = false;
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
          this.merge("guid", erroredApp);
        }
        break;
      }

      default:
        break;
    }
  }
}

export default new AppStore();
