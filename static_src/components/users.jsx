
/**
 * Renders a users pages that allows to switch between all users in a space
 * and all users in the org.
 */

import React from 'react';

import userActions from '../actions/user_actions.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import UserList from './user_list.jsx';
import UserStore from '../stores/user_store.js';

const SPACE_NAME = 'space_users';
const ORG_NAME = 'org_users';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentType = UserStore.currentlyViewedType;

  let users = [];
  let currentUserAccess = false;

  if (currentType === SPACE_NAME) {
    users = UserStore.getAllInSpace(currentSpaceGuid);
    currentUserAccess = UserStore.currentUserHasSpaceRole('space_manager');
  } else {
    users = UserStore.getAllInOrg(currentOrgGuid);
    currentUserAccess = UserStore.currentUserHasOrgRole('org_manager');
  }

  return {
    error: UserStore.getError(),
    currentUserAccess: currentUserAccess,
    currentOrgGuid,
    currentSpaceGuid,
    currentType,
    loading: UserStore.loading,
    empty: !UserStore.loading && !users.length,
    users
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
                                this.resourceGuid,
                                this.resourceType);
  }

  handleRemovePermissions(roleKey, userGuid) {
    userActions.deleteUserRoles(roleKey,
                                userGuid,
                                this.resourceGuid,
                                this.resourceType);
  }

  get resourceType() {
    var resourceType = this.state.currentType === ORG_NAME ? 'org' : 'space';
    return resourceType;
  }

  get resourceGuid() {
    const resourceGuid = this.state.current === ORG_NAME ?
      this.state.currentOrgGuid : this.state.currentSpaceGuid;
    return resourceGuid;
  }

  render() {
    let removeHandler;
    let errorMessage;

    if (this.state.currentType === ORG_NAME) {
      removeHandler = this.handleRemove;
    }

    let content = (<UserList
      initialUsers={ this.state.users }
      initialUserType= { this.state.currentType }
      initialCurrentUserAccess={ this.state.currentUserAccess }
      initialEmpty={ this.state.empty }
      initialLoading={ this.state.loading }
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
      <div>
        { errorMessage }
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
