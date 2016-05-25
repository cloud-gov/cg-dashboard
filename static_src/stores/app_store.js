
/*
 * Store for app data. Will store and update app data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import LoginStore from './login_store.js';
import { appActionTypes } from '../constants.js';

class AppStore extends BaseStore {
  constructor() {
    super();
    this._data = Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch(action.type) {
      case appActionTypes.APP_FETCH:
        cfApi.fetchApp(action.appGuid);
        break;

      case appActionTypes.APP_RECEIVED:
        this.merge('guid', action.app, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      default:
        break;
    }
  }
}

let _AppStore = new AppStore();

export default _AppStore;
