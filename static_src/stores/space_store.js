
/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch (action.type) {
      case spaceActionTypes.SPACE_RECEIVED:
        // TODO move to help to share with other stores
        var toUpdate = this.get(action.space.guid);
        if (toUpdate) {
          toUpdate = Object.assign(toUpdate, action.space); 
        } else {
          this._data.push(action.space);
        }
        this.emitChange();
        break;
    }
  }
}

let _SpaceStore = new SpaceStore();

export default _SpaceStore;
