
/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { orgActionTypes, spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this._data = Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_RECEIVED:
        let spaces = action.org.spaces;
        if (spaces) this.mergeMany('guid', spaces, (changed) => {
          console.log('CHANGED', changed);
          if (changed) this.emitChange();
        });

        break;

      case spaceActionTypes.SPACE_RECEIVED:
        this.merge('guid', action.space, (changed) => {
          if (changed) this.emitChange();
        });
        break;
    }
  }
}

let _SpaceStore = new SpaceStore();

export default _SpaceStore;
