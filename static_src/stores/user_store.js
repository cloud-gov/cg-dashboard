
/*
 * Store for user data. Will store and update user data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import userActions from '../actions/user_actions.js';
import { userActionTypes } from '../constants.js';

// TODO why is this role mapping needed?
const resourceToRole = {
  space: {
    managers: 'space_manager',
    developers: 'space_developer',
    auditors: 'space_auditor'
  },
  org: {
    managers: 'org_manager',
    billing_managers: 'billing_manager',
    auditors: 'org_auditor'
  }
};

class UserStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
    this._currentViewedType = 'space_users';
    this._error = null;
  }

  _registerToActions(action) {
    switch (action.type) {
      case userActionTypes.ORG_USERS_FETCH: {
        this.fetching = true;
        cfApi.fetchOrgUsers(action.orgGuid);
        break;
      }

      case userActionTypes.ORG_USER_ROLES_FETCH: {
        this.fetching = true;
        cfApi.fetchOrgUserRoles(action.orgGuid);
        break;
      }

      case userActionTypes.SPACE_USERS_FETCH: {
        this.fetching = true;
        cfApi.fetchSpaceUsers(action.spaceGuid);
        break;
      }

      case userActionTypes.ORG_USER_ROLES_RECEIVED: {
        this.fetching = false;
        const updates = this.formatSplitResponse(action.orgUserRoles);
        if (updates.length) {
          this.mergeMany('guid', updates, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case userActionTypes.USER_ROLES_ADD: {
        const apiMethodMap = {
          org: cfApi.putOrgUserPermissions,
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
            action.resourceType);
        }).catch((err) => {
          window.console.error(err);
        });
        break;
      }

      case userActionTypes.USER_ROLES_ADDED: {
        const user = this.get(action.userGuid);
        if (user) {
          const role = this.getResourceToRole(action.roles, action.resourceType);
          const userRole = (action.resourceType === 'space') ? user.space_roles :
            user.organization_roles;
          if (userRole && userRole.indexOf(role) === -1) {
            userRole.push(role);
          }
          this.merge('guid', user, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case userActionTypes.USER_ROLES_DELETE: {
        const apiMethodMap = {
          org: cfApi.deleteOrgUserPermissions,
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
          const role = this.getResourceToRole(action.roles, action.resourceType);
          const userRole = (action.resourceType === 'space') ? user.space_roles :
            user.organization_roles;
          const idx = userRole && userRole.indexOf(role);
          if (idx > -1) {
            userRole.splice(idx, 1);
          }

          this.merge('guid', user, (changed) => {
            if (changed) this.emitChange();
          });
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
        this.fetching = false;
        if (updates.length) {
          this.mergeMany('guid', updates, (changed) => {
            if (changed) {
              this._error = null;
              this.emitChange();
            }
          });
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
        this.delete(action.userGuid, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case userActionTypes.ERROR_REMOVE_USER: {
        this._error = action.error;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_CHANGE_VIEWED_TYPE: {
        if (this._currentViewedType !== action.userType) {
          this._currentViewedType = action.userType;
          this.emitChange();
        }
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
    const inSpace = this._data.filter((user) =>
      user.get('spaceGuid') === spaceGuid
    );
    return inSpace.toJS();
  }

  getAllInOrg(orgGuid) {
    const inOrg = this._data.filter((user) =>
      user.get('orgGuid') === orgGuid
    );
    return inOrg.toJS();
  }

  getError() {
    return this._error;
  }

  getResourceToRole(resource, resourceType) {
    if (resourceType !== 'space' && resourceType !== 'org') {
      throw new Error(`unknown resource type ${resourceType}`);
    }
    const role = resourceToRole[resourceType][resource] || resource;
    return role;
  }

  get currentlyViewedType() {
    return this._currentViewedType;
  }

}

const _UserStore = new UserStore();

export default _UserStore;
