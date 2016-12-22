
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

const TAB_SPACE_NAME = 'space_users';
const TAB_ORG_NAME = 'org_users';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentTab = UserStore.currentlyViewedType;

  let users = [];
  let currentUserAccess = false;

  if (currentTab === TAB_SPACE_NAME) {
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
    currentTab,
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
    var resourceType = this.state.currentTab === TAB_ORG_NAME ? 'org' : 'space';
    return resourceType;
  }

  get resourceGuid() {
    const resourceGuid = this.state.currentTab === TAB_ORG_NAME ?
      this.state.currentOrgGuid : this.state.currentSpaceGuid;
    return resourceGuid;
  }

  userUrl(page) {
    return `/#/org/${this.state.currentOrgGuid}/spaces/${this.state.currentSpaceGuid}/users/${page}`;
  }

  get subNav() {
    const tabs = [
      { name: 'space_users' },
      { name: 'org_users' }
    ];
    // TODO refactor link, use a special link component.
    tabs[0].element = (
      <a href={ this.userUrl('space') }>
        Current space users
      </a>
    );

    tabs[1].element = (
      <a href={ this.userUrl('org') }>
        All organization users
      </a>
    );

    return tabs;
  }

  render() {
    let removeHandler;
    let errorMessage;

    if (this.state.currentTab === TAB_ORG_NAME) {
      removeHandler = this.handleRemove;
    }

    let content = (<UserList
      initialUsers={ this.state.users }
      initialUserType= { this.state.currentTab }
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
          <div role="tabpanel">
            { content }
          </div>
        </div>
      </div>
    );
  }

}

Users.propTypes = { };

Users.defaultProps = { };
