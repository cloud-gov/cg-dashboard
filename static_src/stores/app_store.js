
/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { appActionTypes } from '../constants.js';

class AppStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case appActionTypes.APP_FETCH:
        cfApi.fetchApp(action.appGuid);
        break;

      case appActionTypes.APP_STATS_FETCH:
        cfApi.fetchAppStats(action.appGuid);
        break;

      case appActionTypes.APP_RECEIVED:
        this.merge('guid', action.app, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      case appActionTypes.APP_STATS_RECEIVED: {
        const idx = this._data.findIndex((app) => app.guid === action.appGuid);
        if (idx < 0) {
          let newApp = {
            guid: action.appGuid
          };
          newApp = Object.assign({}, newApp, action.app);
          this._data.push(newApp);
        } else {
          this._data[idx] = Object.assign({}, this._data[idx], action.app);
        }
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
}

const _AppStore = new AppStore();

export default _AppStore;
