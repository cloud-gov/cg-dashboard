
/**
 * Renders a list of users.
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import formatDateTime from '../util/format_date';

import Action from './action.jsx';
import Loading from './loading.jsx';
import UserRoleListControl from './user_role_list_control.jsx';
import createStyler from '../util/create_styler';

function stateSetter(props) {
  return {
    users: props.initialUsers,
    userType: props.initialUserType,
    currentUserAccess: props.initialCurrentUserAccess,
    empty: props.initialEmpty,
    loading: props.initialLoading
  };
}

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this.styler = createStyler(style);
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateSetter(nextProps));
  }

  _handleDelete(userGuid, ev) {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    const columns = [
      { label: 'User Name', key: 'username' },
      { label: 'Roles', key: 'permissions' },
      { label: 'Date Created', key: 'created_at' }
    ];

    if (this.props.onRemove) {
      columns.push({ label: 'Actions', key: 'actions' });
    }

    return columns;
  }

  get userTypePretty() {
    return (this.state.userType === 'org_users') ? 'Organization' : 'Space';
  }

  render() {
    let loading = <Loading text="Loading users" />;
    let content = <div>{ loading }</div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No users</h4>;
    } else if (!this.state.loading && this.state.users.length) {
      content = (
      <div>
        <p><em>
        { this.userTypePretty } Managers can change these roles. For details about these roles, see <a href="https://docs.cloudfoundry.org/concepts/roles.html#roles">Cloud Foundry roles and permissions</a>. To invite a new user or change a role, see <a href="https://docs.cloud.gov/apps/managing-teammates/">Managing Teammates</a>.
        </em></p>

        <p><em><strong>To add or remove a role:</strong><br />
          Only { this.userTypePretty } Managers have permission to change these roles. To change a role, click a checkbox and wait a moment for the request to process, then see what happens:
        </em></p>
        <ul>
          <li><em>If you tried adding a role and this was successful, the checkbox will become checked (and you won’t get an error message).</em></li>
          <li><em>If you tried adding a role but didn’t have permission, the checkbox won’t update.</em></li>
          <li><em>If you tried removing a role and this was successful, the checkbox will become unchecked (and you won’t get an error message).</em></li>
          <li><em>If you tried removing a role but didn’t have permission, the checkbox will become unchecked and you’ll get an error message (“You are not authorized to perform the requested action”).</em></li>
        </ul>
        <p><em>
          <a href="https://github.com/18F/cg-deck/issues/409">We’ll improve this.</a>
        </em></p>
        <table>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th className={ column.key }
                  key={ column.key }>
                { column.label }</th>
            )}
            </tr>
          </thead>
          <tbody>
          { this.state.users.map((user) => {
            let actions;
            if (this.props.onRemove) {
              let button = <span></span>;
              if (this.state.currentUserAccess) {
                button = (
                  <Action
                    style="secondary"
                    clickHandler={ this._handleDelete.bind(this, user.guid) }
                    label="delete">
                    <span>Remove User From Org</span>
                  </Action>
                );
              }
              actions = (
                <td style={{ width: '14rem' }}>
                  { button }
                </td>
              );
            }
            return ([
              <tr key={ user.guid }>
                <td><span>{ user.username }</span></td>
                <td key={ `${user.guid}-role` }>
                  <UserRoleListControl
                    initialUserType={ this.state.userType }
                    initialCurrentUserAccess={ this.state.currentUserAccess }
                    onAddPermissions={ this.props.onAddPermissions }
                    onRemovePermissions={ this.props.onRemovePermissions }
                    user={ user }
                  />
                </td>
                <td>{ formatDateTime(user.created_at) }</td>
                { actions }
              </tr>
              ]);
            })}
          </tbody>
        </table>
      </div>
      );
    }

    return (
    <div className={ this.styler('panel-content') }>
      <div className={ this.styler('tableWrapper') }>
        { content }
      </div>
    </div>
    );
  }

}

UserList.propTypes = {
  initialUsers: React.PropTypes.array,
  initialUserType: React.PropTypes.string,
  initialCurrentUserAccess: React.PropTypes.bool,
  initialEmpty: React.PropTypes.bool,
  initialLoading: React.PropTypes.bool,
  // Set to a function when there should be a remove button.
  onRemove: React.PropTypes.func,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func
};

UserList.defaultProps = {
  initialUsers: [],
  initialUserType: 'space_users',
  initialCurrentUserAccess: false,
  initialEmpty: false,
  initialLoading: false
};
