
/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { orgActionTypes, spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_RECEIVED:
        var spaces = action.org.spaces;
        if (spaces) {
          this._data = this._merge(this._data, spaces);  
          this.emitChange();
        }
        break;

      case spaceActionTypes.SPACE_RECEIVED:
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
