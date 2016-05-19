
/*
 * Store for user data. Will store and update user data on changes from UI and
 * server.
 */

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import userActions from '../actions/user_actions.js';
import { userActionTypes } from '../constants.js';

const resourceToRole = {
  managers: 'org_manager',
  billing_managers: 'billing_manager',
  auditors: 'org_auditor'
};

class UserStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
    this._error = null;
  }

  _registerToActions(action) {
    switch (action.type) {
      case userActionTypes.ORG_USERS_FETCH: {
        cfApi.fetchOrgUsers(action.orgGuid);
        break;
      }

      case userActionTypes.ORG_USER_ROLES_FETCH: {
        cfApi.fetchOrgUserRoles(action.orgGuid);
        break;
      }

      case userActionTypes.SPACE_USERS_FETCH: {
        cfApi.fetchSpaceUsers(action.spaceGuid);
        break;
      }

      case userActionTypes.ORG_USER_ROLES_RECEIVED: {
        const updates = this.formatSplitResponse(action.orgUserRoles);
        if (updates.length) {
          this._data = this._merge(this._data, updates);
          this.emitChange();
        }
        break;
      }

      case userActionTypes.USER_ROLES_ADD: {
        const apiMethodMap = {
          organization: cfApi.putOrgUserPermissions,
          space: cfApi.putSpaceUserPermissions
        };
        const api = apiMethodMap[action.resourceType];

        api(
          action.userGuid,
          action.resourceGuid,
          action.roles
        ).then(() => {
          userActions.addedUserRoles(
            action.roles,
            action.userGuid,
            action.resouceType);
        }).catch((err) => {
          window.console.error(err);
        });
        break;
      }

      case userActionTypes.USER_ROLES_ADDED: {
        const user = this.get(action.userGuid);
        if (user) {
          const role = resourceToRole[action.roles] || action.roles;
          if (user.organization_roles &&
              user.organization_roles.indexOf(role) === -1) {
            user.organization_roles.push(role);
            this.emitChange();
          }
        }
        break;
      }

      case userActionTypes.USER_ROLES_DELETE: {
        const apiMethodMap = {
          organization: cfApi.deleteOrgUserPermissions,
          space: cfApi.deleteSpaceUserPermissions
        };
        const api = apiMethodMap[action.resourceType];

        api(
          action.userGuid,
          action.resourceGuid,
          action.roles
        ).then(() => {
          userActions.deletedUserRoles(
            action.roles,
            action.userGuid,
            action.resourceType);
        }).catch((err) => {
          window.console.error(err);
        });
        break;
      }

      case userActionTypes.USER_ROLES_DELETED: {
        const user = this.get(action.userGuid);
        if (user) {
          const role = resourceToRole[action.roles] || action.roles;
          const idx = user.organization_roles &&
            user.organization_roles.indexOf(role);
          if (idx > -1) {
            user.organization_roles.splice(idx, 1);
            this.emitChange();
          }
        }
        break;
      }

      case userActionTypes.SPACE_USERS_RECEIVED:
      case userActionTypes.ORG_USERS_RECEIVED: {
        let updates = this.formatSplitResponse(action.users);
        updates = updates.map((update) => {
          const updateCopy = Object.assign({}, update);
          if (action.orgGuid) {
            updateCopy.orgGuid = action.orgGuid;
          }
          if (action.spaceGuid) {
            updateCopy.spaceGuid = action.spaceGuid;
          }
          return updateCopy;
        });
        if (updates.length) {
          this._data = this._merge(this._data, updates);
          this._error = null;
          this.emitChange();
        }
        break;
      }

      case userActionTypes.USER_DELETE: {
        const orgPermissionsReq = cfApi.deleteOrgUserPermissions(
          action.userGuid,
          action.orgGuid,
          'users');

        orgPermissionsReq.then(() => {
          cfApi.deleteUser(action.userGuid, action.orgGuid);
        });

        break;
      }

      case userActionTypes.USER_DELETED: {
        const deleted = this.get(action.userGuid);
        if (deleted) {
          const index = this._data.indexOf(deleted);
          this._data.splice(index, 1);
          this._error = null;
          this.emitChange();
        }
        break;
      }

      case userActionTypes.ERROR_REMOVE_USER: {
        this._error = action.error;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  /**
   * Get all users in a certain space
   */
  getAllInSpace(spaceGuid) {
    return this._data.filter((user) => user.spaceGuid === spaceGuid);
  }

  getAllInOrg(orgGuid) {
    return this._data.filter((user) => user.orgGuid === orgGuid);
  }

  getError() {
    return this._error;
  }

}

const _UserStore = new UserStore();

export default _UserStore;
