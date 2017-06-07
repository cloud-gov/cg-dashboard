
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
import UserStore from '../stores/user_store.js';

const SPACE_NAME = 'space_users';
const ORG_NAME = 'org_users';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentType = UserStore.currentlyViewedType;
  const currentUser = UserStore.currentUser;

  let users = [];
  let currentUserAccess = false;
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
    currentUserAccess,
    currentOrgGuid,
    currentSpaceGuid,
    entityGuid,
    currentType,
    loading: UserStore.loading,
    empty: !UserStore.loading && !users.length,
    users,
    userInviteError: UserStore.getInviteError()
  };
}

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
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

  _onChange() {
    this.setState(stateSetter());
  }

  handleRemove(userGuid, ev) {
    ev.preventDefault();
    userActions.deleteUser(userGuid, this.state.currentOrgGuid);
  }

  handleAddPermissions(roleKey, userGuid) {
    userActions.addUserRoles(roleKey,
                                userGuid,
                                this.entityGuid,
                                this.resourceType);
  }

  handleRemovePermissions(roleKey, userGuid) {
    userActions.deleteUserRoles(roleKey,
                                userGuid,
                                this.entityGuid,
                                this.resourceType);
  }

  get resourceType() {
    return this.state.currentType === ORG_NAME ? 'org' : 'space';
  }

  get entityGuid() {
    const entityGuid = this.state.currentType === ORG_NAME ?
      this.state.currentOrgGuid : this.state.currentSpaceGuid;
    return entityGuid;
  }

  render() {
    let removeHandler;
    let errorMessage;

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
      onRemove={ removeHandler }
      onAddPermissions={ this.handleAddPermissions }
      onRemovePermissions={ this.handleRemovePermissions }
    />);

    if (this.state.error) {
      // TODO make this an error message component
      errorMessage = (
        <div className="alert alert-danger" role="alert">
          { this.state.error.description }</div>
      );
    }

    return (
      <div className="test-users">
        { errorMessage }
        <UsersInvite error={ this.state.userInviteError } />
        <div>
          <div>
            { content }
          </div>
        </div>
      </div>
    );
  }

}

Users.propTypes = { };

Users.defaultProps = { };
