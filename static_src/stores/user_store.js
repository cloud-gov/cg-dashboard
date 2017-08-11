
/*
 * Store for user data. Will store and update user data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { userActionTypes, errorActionTypes } from '../constants.js';

export class UserStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = new Immutable.List();
    this._currentViewedType = 'space_users';
    this._currentUserGuid = null;
    this._currentUserIsAdmin = false;
    this._error = null;
    this._saving = false;
    this._inviteDisabled = false;
    this._usersSelectorDisabled = false;
    this._userListNotification = {};
    this._loading = {};
  }

  get loading() {
    return !this._loading || this._loading.currentUser ||
      this._loading.entityUsers || this._loading.entityRoles;
  }

  _registerToActions(action) {
    switch (action.type) {
      case userActionTypes.ORG_USERS_FETCH: {
        this._loading.entityUsers = true;
        break;
      }

      case userActionTypes.ORG_USER_ROLES_FETCH: {
        this._loading.entityRoles = true;
        break;
      }

      case userActionTypes.SPACE_USER_ROLES_FETCH: {
        this._loading.entityRoles = true;
        break;
      }

      case userActionTypes.ORG_USER_ROLES_RECEIVED: {
        this._loading.entityRoles = false;
        const updatedUsers = this.mergeRoles(action.orgUserRoles, action.orgGuid,
          'organization_roles');
        this.mergeMany('guid', updatedUsers, () => { });
        this.emitChange();
        break;
      }

      case userActionTypes.SPACE_USER_ROLES_RECEIVED: {
        // There is no SPACE_USERS_RECEIVED for now unlike orgs,
        // so we will set both loading entity rules to false.
        this._loading.entityUsers = false;
        this._loading.entityRoles = false;

        const { users, spaceGuid } = action;

        // Force an update to the cached list of users, otherwise mergeRoles
        // won't be able to find the new user
        const updatedUsers = this.mergeRoles(users, spaceGuid,
          'space_roles');
        this.mergeMany('guid', updatedUsers, () => { });
        this.emitChange();
        break;
      }

      case userActionTypes.USER_INVITE_TRIGGER: {
        this._inviteDisabled = true;
        this._userListNotificationError = null;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ORG_ASSOCIATE: {
        this._inviteInputActive = false;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_SPACE_ASSOCIATE: {
        this._inviteInputActive = false;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ORG_ASSOCIATED : {
        const user = Object.assign({}, {
          guid: action.userGuid,
          roles: { [action.entityGuid]: [] }
        }, action.user);
        this.associateNewUserToEntity(user);
        break;
      }

      case userActionTypes.USER_SPACE_ASSOCIATED: {
        const user = Object.assign({}, action.user, {
          guid: action.userGuid,
          space_roles: { [action.entityGuid]: action.user.space_roles }
        });
        this.associateNewUserToEntity(user);
        break;
      }

      case userActionTypes.USER_ROLES_ADD: {
        this._saving = true;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLES_ADDED: {
        this._saving = false;
        const user = this.get(action.userGuid);
        this.addUserRole(user, action.entityType, action.entityGuid,
          action.roles, () => this.emitChange());
        break;
      }

      case userActionTypes.USER_ROLES_DELETE: {
        this._saving = true;
        const user = this.get(action.userGuid);
        if (user) {
          const savingUser = Object.assign({}, user, { saving: true });
          this.merge('guid', savingUser);
        }
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLES_DELETED: {
        this._saving = false;
        const user = this.get(action.userGuid);
        this.deleteUserRole(user, action.entityType, action.entityGuid,
          action.roles, () => this.emitChange());
        break;
      }

      case userActionTypes.ORG_USERS_RECEIVED: {
        this._loading.entityUsers = false;
        const orgGuid = action.orgGuid;
        const orgUsers = action.users;

        const updatedUsers = orgUsers.map((orgUser) =>
          Object.assign({}, orgUser, { orgGuid })
        );

        this.mergeMany('guid', updatedUsers, (changed) => {
          if (changed) {
            this._error = null;
          }
          this.emitChange();
        });
        break;
      }

      // TODO: this should not be happening in the user store
      case userActionTypes.USER_DELETE: {
        // Nothing should happen.
        break;
      }

      case userActionTypes.USER_DELETED: {
        this.delete(action.userGuid, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case userActionTypes.USER_REMOVED_ALL_SPACE_ROLES: {
        const user = this.get(action.userGuid);
        if (user) {
          this.deleteProp(action.userGuid, 'space_roles', () => this.emitChange());
        }
        break;
      }

      case userActionTypes.ERROR_REMOVE_USER: {
        this._error = action.error;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_INVITE_ERROR: {
        this._userListNotificationError = Object.assign({}, action.err, {
          contextualMessage: action.contextualMessage
        });
        this._usersSelectorDisabled = false;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLE_CHANGE_ERROR: {
        this._saving = false;
        this._error = Object.assign({}, action.error, {
          description: action.message
        });

        this.emitChange();
        break;
      }

      case userActionTypes.USER_LIST_NOTICE_CREATED: {
        this._inviteDisabled = false;
        const noticeType = action.noticeType;
        const description = action.description;
        const notice = Object.assign({}, { noticeType }, { description });
        this._userListNotification = notice;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_LIST_NOTICE_DISMISSED: {
        this._userListNotification = {};
        this.emitChange();
        break;
      }

      case userActionTypes.CURRENT_USER_INFO_RECEIVED: {
        const guid = action.currentUser.user_id;
        const userInfo = Object.assign(
          {},
          action.currentUser,
          { guid }
        );
        this.merge('guid', userInfo, () => {
          this._currentUserGuid = guid;

          // Always emit change
          this.emitChange();
        });
        break;
      }

      case userActionTypes.CURRENT_UAA_INFO_RECEIVED: {
        const uaaInfo = action.currentUaaInfo;
        this._currentUserIsAdmin = false;

        if (uaaInfo.groups) {
          // Check for UAA permissions here.
          // If the response does not have and object in the groups array
          // with a display key that equals 'cloud_controller.admin',
          // then return is false.
          // If there is a proper response, then the return is true.
          this._currentUserIsAdmin = !!(uaaInfo.groups.find((group) => (
            group.display === 'cloud_controller.admin'
          )));
        }

        // Always emit change
        this.emitChange();
        break;
      }

      case userActionTypes.USER_FETCH: {
        this.merge('guid', { guid: action.userGuid, fetching: true });
        break;
      }

      case userActionTypes.USER_RECEIVED: {
        const receivedUser = Object.assign({}, action.user, { fetching: false });
        if (action.user) {
          this.merge('guid', receivedUser, () => this.emitChange());
        }
        break;
      }

      case userActionTypes.CURRENT_USER_FETCH: {
        this._loading.currentUser = true;
        this.emitChange();
        break;
      }

      case userActionTypes.CURRENT_USER_RECEIVED: {
        this._loading.currentUser = false;
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

      case errorActionTypes.CLEAR: {
        this._error = null;
        this._saving = false;
        this._userListNotification = {};
        this._userListNotificationError = null;
        this._loading = {};
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
  associateNewUserToEntity(user) {
    this._inviteInputActive = true;

    if (!this.get(user.guid)) {
      this.push(user);
    } else {
      this.merge('guid', user, () => {});
    }

    this.emitChange();
  }

  addUserRole(user, entityType, entityGuid, addedRole, cb) {
    const updatedUser = user;
    if (updatedUser) {
      if (entityType === 'space') {
        if (!updatedUser.space_roles) updatedUser.space_roles = {};
        const updatedRoles = new Set(user.space_roles[entityGuid] || []);
        updatedRoles.add(addedRole);
        updatedUser.space_roles[entityGuid] = Array.from(updatedRoles);
      } else {
        if (!updatedUser.roles) updatedUser.roles = {};
        const updatedRoles = new Set(user.roles[entityGuid] || []);
        updatedRoles.add(addedRole);
        updatedUser.roles[entityGuid] = Array.from(updatedRoles);
      }
      this.merge('guid', updatedUser, () => {});
      cb();
    }
  }

  deleteUserRole(user, entityType, entityGuid, deletedRole, cb) {
    const updatedUser = user;
    if (updatedUser) {
      let roles;
      if (entityType === 'space') {
        roles = updatedUser.space_roles && updatedUser.space_roles[entityGuid];
      } else {
        roles = updatedUser.roles && updatedUser.roles[entityGuid];
      }
      if (roles) {
        const idx = deletedRole && roles.indexOf(deletedRole);
        if (idx > -1) {
          roles.splice(idx, 1);
        }
      }
      this.merge('guid', updatedUser, () => {});
      cb();
    }
  }

  /**
   * Get all users in a certain space
   */
  getAllInSpace(spaceGuid) {
    const usersInSpace = this._data.filter((user) =>
      !!user.get('space_roles') && !!user.get('space_roles').get(spaceGuid)
    );
    return usersInSpace.toJS();
  }

  getAllInOrg(orgGuid) {
    const usersInOrg = this._data.filter((user) =>
      !!user.get('roles') && !!user.get('roles').get(orgGuid)
    );

    return usersInOrg.toJS();
  }

  getAllInOrgAndNotSpace() {
    const usersInOrg = this._data.toJS().filter((user) =>
      !user.space_roles
    );

    return usersInOrg;
  }

  getError() {
    return this._error;
  }

  get isLoadingCurrentUser() {
    return this._loading.currentUser === true;
  }

  mergeRoles(roles, entityGuid, entityType) {
    return roles.map((role) => {
      const user = Object.assign({}, this.get(role.guid) || { guid: role.guid });
      const updatingRoles = role[entityType] || [];

      if (entityType === 'space_roles') {
        if (!user.space_roles) user.space_roles = {};
        user.space_roles[entityGuid] = updatingRoles;
      } else {
        if (!user.roles) user.roles = {};
        user.roles[entityGuid] = updatingRoles;
      }
      return user;
    });
  }

  /*
   * Returns if a user with userGuid has ANY role within the enity of the
   * entityGuid.
   * @param {string} userGuid - The guid of the user.
   * @param {string} entityGuid - The guid of the entity (space or org) to
   * check roles for.
   * @param {string|array} roleToCheck - Either a single role as a string or
   * an array of roles to check if the user has ANY of the roles.
   * @return {boolean} Whether the user has the role.
   */
  hasRole(userGuid, entityGuid, roleToCheck) {
    if (this.isAdmin()) {
      return true;
    }

    let wrappedRoles = roleToCheck;
    if (!Array.isArray(roleToCheck)) {
      wrappedRoles = [roleToCheck];
    }

    const key = entityGuid;
    const user = this.get(userGuid);
    const roles = [...(user && user.roles && user.roles[key] || []),
      ...(user && user.space_roles && user.space_roles[key] || [])];
    return !!roles.find((role) => wrappedRoles.includes(role));
  }

  usersSelectorDisabled() {
    return this._usersSelectorDisabled;
  }

  inviteDisabled() {
    return this._inviteDisabled;
  }

  isAdmin() {
    return this._currentUserIsAdmin;
  }

  getUserListNotification() {
    return this._userListNotification;
  }

  getUserListNotificationError() {
    return this._userListNotificationError;
  }

  get isSaving() {
    return this._saving;
  }

  get currentUser() {
    return this.get(this._currentUserGuid);
  }

  get currentlyViewedType() {
    return this._currentViewedType;
  }
}

const _UserStore = new UserStore();

export default _UserStore;
