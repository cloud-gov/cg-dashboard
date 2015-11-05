
/**
 * Renders a users pages that allows to switch between all users in a space
 * and all users in the org.
 */

import React from 'react';

import userActions from '../actions/user_actions.js';
import UserList from './user_list.jsx';
import UserStore from '../stores/user_store.js';
import Tabnav from './tabnav.jsx';

const TAB_SPACE_NAME = 'space_users',
      TAB_ORG_NAME = 'org_users';

function stateSetter(currentState) {
  var users = [];
  if (currentState.currentTab === TAB_SPACE_NAME) {
    users = UserStore.getAllInSpace(currentState.currentSpaceGuid);
  } else {
    users = UserStore.getAllInOrg(currentState.currentOrgGuid);
  }
  return {
    users: users
  }
}

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentOrgGuid: props.initialOrgGuid,
      currentSpaceGuid: props.initialSpaceGuid,
      currentTab: props.initialCurrentTab,
      users: []
    };
  }
  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
    this._setTab(this.props.initialCurrentTab);
  }

  _onChange = () => {
    this.setState(stateSetter(this.state));
  }

  _setTab = (tab) => {
    this.setState({
      currentTab: tab
    });
    if (tab === TAB_SPACE_NAME) {
       userActions.fetchSpaceUsers(this.state.currentSpaceGuid); 
    } else {
       userActions.fetchOrgUsers(this.state.currentOrgGuid); 
    }
    this.setState(stateSetter(this.state));
  }

  handleTabClick = (tab, ev) => {
    ev.preventDefault();
    this._setTab(tab);
  }

  handleRemove = (userGuid, ev) => {
    ev.preventDefault();
    userActions.deleteUser(userGuid, this.state.currentOrgGuid);
  }

  get subNav() {
    var tabs = [
      { name: 'space_users' },
      { name: 'org_users' }
    ];
    // TODO refactor link, use a special link component.
    tabs[0].element = (
      <a onClick={ this.handleTabClick.bind(this, tabs[0].name) }>
        Current space users
      </a>
    );

    tabs[1].element = (
      <a onClick={ this.handleTabClick.bind(this, tabs[1].name) }>
        All organization users
      </a>
    );

    return tabs;
  }

  render() {
    var removeHandler;

    if (this.state.currentTab === TAB_ORG_NAME) {
      removeHandler = this.handleRemove;  
    }

    return (
      <div>
      <Tabnav items={ this.subNav } 
        classes={ ['test-subnav-users'] }
        initialItem={ this.state.currentTab } />
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active">
            <UserList onRemove={ removeHandler } 
                initialUsers={ this.state.users } />
          </div>
        </div>
      </div>
    );
  }

}

Users.propTypes = {
  initialCurrentTab: React.PropTypes.string.isRequired,
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

Users.defaultProps = {
  initialCurrentTab: 'space_users'
}
