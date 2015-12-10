
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
    this._error = null;
  }

  _registerToActions(action) {
    switch(action.type) {
      case userActionTypes.ORG_USERS_FETCH:
        cfApi.fetchOrgUsers(action.orgGuid);
        break;

      case userActionTypes.ORG_USER_ROLES_FETCH:
        cfApi.fetchOrgUserRoles(action.orgGuid);
        break;

      case userActionTypes.SPACE_USERS_FETCH:
        cfApi.fetchSpaceUsers(action.spaceGuid);
        break;

      case userActionTypes.ORG_USER_ROLES_RECEIVED:
        var updates = this.formatSplitResponse(action.orgUserRoles);
        if (updates.length) {
          this._data = this._merge(this._data, updates);
          this.emitChange();
        }
        break;

      case userActionTypes.USER_ROLES_ADD:
        var apiMethodMap = {
          'organization': cfApi.putOrgUserPermissions,
          'space': cfApi.putSpaceUserPermissions
        }
        var api = apiMethodMap[action.resourceType];
        api(
          action.userGuid,
          action.resourceGuid,
          action.roles
        );
        break;

      case userActionTypes.USER_ROLES_DELETE:
        var apiMethodMap = {
          'organization': cfApi.deleteOrgUserPermissions,
          'space': cfApi.deleteSpaceUserPermissions
        }
        var api = apiMethodMap[action.resourceType];
        api(
          action.userGuid,
          action.resourceGuid,
          action.roles
        );
        break;

      case userActionTypes.SPACE_USERS_RECEIVED:
      case userActionTypes.ORG_USERS_RECEIVED:
        var updates = this.formatSplitResponse(action.users);
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
          this._error = null;
          this.emitChange();
        }
        break;

      case userActionTypes.USER_DELETE:
        var orgPermissionsReq = cfApi.deleteOrgUserPermissions(
          action.userGuid,
          action.orgGuid,
          'users');

        orgPermissionsReq.then((res) => {
          cfApi.deleteUser(action.userGuid, action.orgGuid);
        });

        break;

      case userActionTypes.USER_DELETED:
        var deleted = this.get(action.userGuid);
        if (deleted) {
          var index = this._data.indexOf(deleted);
          this._data.splice(index, 1);
          this._error = null;
          this.emitChange();
        }
        break;

      case userActionTypes.ERROR_REMOVE_USER:
        this._error = action.error;
        this.emitChange();
        break;

      default:
        break;
    }
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

  getError() {
    return this._error;
  }

};

let _UserStore = new UserStore();

export default _UserStore;
