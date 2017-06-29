
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

const SPACE_NAME = SpaceStore.cfName;
const ORG_NAME = OrgStore.cfName;

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
                                          'space_manager');
  } else {
    users = UserStore.getAllInOrg(currentOrgGuid);
    entityGuid = currentOrgGuid;
    currentUserAccess = UserStore.hasRole(currentUser.guid, currentOrgGuid,
                                          'org_manager');
  }

  return {
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
    inviteNotices: UserStore._inviteNotification,
    userInviteError: UserStore.getInviteError()
  };
}

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
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
    userActions.clearInviteNotifications();
  }

  handleAddPermissions(roleKey, apiKey, userGuid) {
    userActions.addUserRoles(roleKey,
                                apiKey,
                                userGuid,
                                this.entityGuid,
                                this.entityType);
  }

  handleRemovePermissions(roleKey, apiKey, userGuid) {
    userActions.deleteUserRoles(roleKey,
                                apiKey,
                                userGuid,
                                this.entityGuid,
                                this.entityType);
  }

  handleRemove(userGuid, ev) {
    ev.preventDefault();
    userActions.deleteUser(userGuid, this.state.currentOrgGuid);
  }

  get entityType() {
    return this.state.currentType === ORG_NAME ? 'org' : 'space';
  }

  get entityGuid() {
    const entityGuid = this.state.currentType === ORG_NAME ?
      this.state.currentOrgGuid : this.state.currentSpaceGuid;
    return entityGuid;
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let removeHandler;

    if (this.state.currentType === ORG_NAME) {
      removeHandler = this.handleRemove;
    }

    let content = (<UserList
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
    />);

    let notification;
    let userInvite;

    if (this.state.inviteNotices.description) {
      const notice = this.state.inviteNotices;
      notification = (
        <Notification
          message={ notice.description }
          actions={ [] }
          onDismiss={ this.onNotificationDismiss }
          status="finish"
        />
      );
    } else {
      // If there's nothing, let's reset the notification to null.
      notification = null;
    }

    if (this.state.currentType === ORG_NAME) {
      userInvite = (
        <div className="test-users">
          <UsersInvite
            inviteDisabled={ this.state.inviteDisabled }
            currentUserAccess={ this.state.currentUserAccess }
            error={ this.state.userInviteError }
          />
        </div>
      );
    }

    return (
      <div className="test-users">
        <ErrorMessage error={this.state.error} />
        { userInvite }
        { notification }
        <div>
          <div>
            { content }
          </div>
        </div>
      </div>
    );
  }
}

Users.propTypes = {};

Users.defaultProps = {};
