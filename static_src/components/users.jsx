
/**
 * Renders a users pages that allows to switch between all users in a space
 * and all users in the org.
 */

import React from 'react';

import userActions from '../actions/user_actions.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import UserList from './user_list.jsx';
import UsersInvite from './users_invite.jsx';
import Notification from './notification.jsx';
import UserStore from '../stores/user_store.js';
import ErrorMessage from './error_message.jsx';
import PanelDocumentation from './panel_documentation.jsx';

const propTypes = {};
const SPACE_NAME = SpaceStore.cfName;
const ORG_NAME = OrgStore.cfName;
const ORG_MANAGER = 'org_manager';
const SPACE_MANAGER = 'space_manager';
const ORG_ENTITY = 'organization';
const SPACE_ENTITY = 'space';
const cfCliLink = 'https://docs.cloudfoundry.org/adminguide/cli-user-management.html#space-roles';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentType = UserStore.currentlyViewedType;
  const currentUser = UserStore.currentUser;
  const isSaving = UserStore.isSaving;

  let users = [];
  let currentUserAccess = false;
  const inviteDisabled = UserStore.inviteDisabled();
  let entityGuid;

  if (currentType === SPACE_NAME) {
    users = UserStore.getAllInSpace(currentSpaceGuid);
    entityGuid = currentSpaceGuid;
    currentUserAccess = UserStore.hasRole(currentUser.guid, currentSpaceGuid,
                                          SPACE_MANAGER);
  } else {
    users = UserStore.getAllInOrg(currentOrgGuid);
    entityGuid = currentOrgGuid;
    currentUserAccess = UserStore.hasRole(currentUser.guid, currentOrgGuid,
                                          ORG_MANAGER);
  }

  return {
    currentUser,
    error: UserStore.getError(),
    inviteDisabled,
    currentUserAccess,
    currentOrgGuid,
    currentSpaceGuid,
    entityGuid,
    currentType,
    isSaving,
    loading: UserStore.loading,
    empty: !UserStore.loading && !users.length,
    users,
    userListNotices: UserStore._userListNotification,
    userListNoticeError: UserStore.getUserListNotificationError()
  };
}

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleAddPermissions = this.handleAddPermissions.bind(this);
    this.handleRemovePermissions = this.handleRemovePermissions.bind(this);
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  onNotificationDismiss(ev) {
    ev.preventDefault();
    userActions.clearUserListNotifications();
  }

  handleAddPermissions(roleKey, apiKey, userGuid) {
    userActions.addUserRoles(
      roleKey,
      apiKey,
      userGuid,
      this.entityGuid,
      this.entityType
    );
  }

  handleRemovePermissions(roleKey, apiKey, userGuid) {
    userActions.deleteUserRoles(
      roleKey,
      apiKey,
      userGuid,
      this.entityGuid,
      this.entityType
    );
  }

  handleRemoveUser(userGuid, ev) {
    ev.preventDefault();
    userActions.deleteUser(userGuid, this.state.currentOrgGuid);
  }

  handleRemoveSpaceRoles(userGuid, ev) {
    ev.preventDefault();
    userActions.removeAllSpaceRoles(userGuid, this.entityGuid);
  }

  get entityType() {
    return this.isOrganization ? ORG_ENTITY : SPACE_ENTITY;
  }

  get isOrganization() {
    return this.state.currentType === ORG_NAME;
  }

  get isSpace() {
    return this.state.currentType === SPACE_NAME;
  }

  get entityGuid() {
    const entityGuid = this.isOrganization ?
      this.state.currentOrgGuid : this.state.currentSpaceGuid;
    return entityGuid;
  }

  get currentUserIsOrgManager() {
    const { currentUser } = this.state;
    const { currentOrgGuid } = OrgStore;

    return UserStore.hasRole(currentUser.guid, currentOrgGuid, ORG_MANAGER);
  }

  get notification() {
    const { userListNotices } = this.state;

    if (!userListNotices.description) return null;

    return (
      <Notification
        message={ userListNotices.description }
        actions={ [] }
        onDismiss={ this.onNotificationDismiss }
        status="finish"
      />
    );
  }

  get userInvite() {
    if (!this.currentUserIsOrgManager) {
      return (
        <PanelDocumentation>
          Currently, only an org manager can invite users to this { this.entityType } via
          the dashboard. If the user you want to add is already a member
          of this organization, you can invite them using the
          <a href={ cfCliLink }> cloud foundry command line interface. </a>
          Speak to your org manager if you need to add a user to this { this.entityType } who
          is not a member of this organization.
        </PanelDocumentation>
      );
    }

    return (
      <UsersInvite
        inviteEntityType={ this.entityType }
        inviteDisabled={ this.state.inviteDisabled }
        currentUserAccess={ this.state.currentUserAccess }
        error={ this.state.userListNoticeError }
      />
    );
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let removeHandler;

    if (this.isOrganization) {
      removeHandler = this.handleRemoveUser;
    } else if (this.isSpace) {
      removeHandler = this.handleRemoveSpaceRoles;
    }

    return (
      <div className="test-users">
        <ErrorMessage error={this.state.error} />
        { this.userInvite }
        { this.notification }
        <UserList
          users={ this.state.users }
          userType= { this.state.currentType }
          entityGuid={ this.state.entityGuid }
          currentUserAccess={ this.state.currentUserAccess }
          empty={ this.state.empty }
          loading={ this.state.loading }
          saving={ this.state.isSaving }
          onRemove={ removeHandler }
          onAddPermissions={ this.handleAddPermissions }
          onRemovePermissions={ this.handleRemovePermissions }
        />
      </div>
    );
  }
}

Users.propTypes = propTypes;
