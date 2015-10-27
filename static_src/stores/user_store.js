
/*
 * Store for user data. Will store and update user data on changes from UI and
 * server.
 */

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { userActionTypes } from '../constants.js';

class UserStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch(action.type) {
      case userActionTypes.ORG_USERS_FETCH:
        cfApi.fetchOrgUsers(action.orgGuid);
        break;

      case userActionTypes.SPACE_USERS_FETCH:
        cfApi.fetchSpaceUsers(action.spaceGuid);
        break;

      case userActionTypes.SPACE_USERS_RECEIVED:
      case userActionTypes.ORG_USERS_RECEIVED:
        var updates = this._formatSplitRes(action.users);
        updates = updates.map((update) => {
          if (action.orgGuid) {
            update.orgGuid = action.orgGuid;
          }
          if (action.spaceGuid) {
            update.spaceGuid = action.spaceGuid;
          }
          return update;
        });
        if (updates.length) {
          this._data = this._merge(this._data, updates);
          this.emitChange();
        }
        break;

      default:
        break;
    }
  }

  // TODO move all of this to base store, I've found they're all the same.
  get(guid) {
    if (guid) {
      return this._data.find((user) => {
        return user.guid === guid;
      });
    }
  }

  getAll() {
    return this._data;
  }

  /**
   * Get all users in a certain space
   */
  getAllInSpace(spaceGuid) {
    return this._data.filter((user) => {
      return user.spaceGuid === spaceGuid;
    });
  }

  getAllInOrg(orgGuid) {
    return this._data.filter((user) => {
      return user.orgGuid === orgGuid;
    });
  }

};

let _UserStore = new UserStore();

export default _UserStore;
