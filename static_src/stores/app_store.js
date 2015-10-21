
import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import LoginStore from './login_store.js';
import { appActionTypes } from '../constants.js';

class AppStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch(action.type) {
      case appActionTypes.APP_FETCH:
        cfApi.fetchApp(action.appGuid);
        break;

      case appActionTypes.APP_RECEIVED:
        // TODO only emit change event if updates actually change local data.
        this._data = this._merge(this._data, [action.app]);
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get(guid) {
    if (guid) {
      return this._data.find((app) => {
        return app.guid === guid;
      });
    }
  }

  getAll() {
    return this._data;
  }
}

let _AppStore = new AppStore();

export default _AppStore;
