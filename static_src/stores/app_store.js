
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
    this._fetchingStats = false;
    this._currentlyEmpty = false;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case appActionTypes.APP_FETCH:
        cfApi.fetchApp(action.appGuid);
        this.fetching = true;
        break;

      case appActionTypes.APP_STATS_FETCH:
        cfApi.fetchAppStats(action.appGuid);
        this.fetchingStats = true;
        break;

      case appActionTypes.APP_RECEIVED:
        this.fetching = false;
        if (!action.app.guid) {
          this._currentlyEmpty = true;
        }
        this.merge('guid', action.app, () => { });
        this.emitChange();
        break;

      case appActionTypes.APP_STATS_RECEIVED: {
        const app = Object.assign({}, action.app, { guid: action.appGuid });
        this.fetchingStats = false;
        this.merge('guid', app, () => {
          this.emitChange();
        });
        break;
      }

      case appActionTypes.APP_ALL_FETCH: {
        cfApi.fetchAppAll(action.appGuid);
        this.fetching = true;
        break;
      }

      case appActionTypes.APP_ALL_RECEIVED: {
        this.fetching = false;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  isEmpty() {
    return this._currentlyEmpty;
  }
}

const _AppStore = new AppStore();

export default _AppStore;
