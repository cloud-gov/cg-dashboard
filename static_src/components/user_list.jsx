
/**
 * Renders a list of users.
 */

import React from 'react';

import formatDateTime from '../util/format_date';

import Button from './button.jsx';
import UserRoleListControl from './user_role_list_control.jsx';

import createStyler from '../util/create_styler';
import baseStyles from 'cloudgov-style/css/base.css';
import navStyles from 'cloudgov-style/css/components/nav.css';


export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      users: props.initialUsers,
      userType: props.initialUserType,
      currentUserAccess: props.initialCurrentUserAccess
    };
    this.styler = createStyler(baseStyles, navStyles);
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      users: nextProps.initialUsers,
      userType: nextProps.initialUserType,
      currentUserAccess: nextProps.initialCurrentUserAccess
    });
  }

  _handleDelete(userGuid, ev) {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    const columns = [
      { label: 'Name', key: 'username' },
      { label: 'Permissions', key: 'permissions' },
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
    let content = <h4 className="test-none_message">No users</h4>;

    if (this.state.users.length) {
      content = (
      <div>
        <p><em>
        { this.userTypePretty } Managers can change these roles. For details about these roles, see <a href="https://docs.cloudfoundry.org/concepts/roles.html#roles">Cloud Foundry roles and permissions</a>. To invite a new user, see <a href="https://docs.cloud.gov/apps/managing-teammates/">Managing Teammates</a>.
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
        <table sortable={ true }>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th column={ column.label } className={ column.key }
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
                  <Button
                    classes={[this.styler('usa-button-secondary')]}
                    onClickHandler={ this._handleDelete.bind(this, user.guid) }
                    label="delete">
                    <span>Remove User From Org</span>
                  </Button>
                );
              }
              actions = (
                <td column="Actions" style={{ width: '14rem' }}>
                  { button }
                </td>
              );
            }
            return ([
              <tr key={ user.guid }>
                <td column="Name"><span>{ user.username }</span></td>
                <td column="Permissions" key={ `${user.guid}-role` }>
                  <UserRoleListControl
                    initialUserType={ this.state.userType }
                    initialCurrentUserAccess={ this.state.currentUserAccess }
                    onAddPermissions={ this.props.onAddPermissions }
                    onRemovePermissions={ this.props.onRemovePermissions }
                    user={ user }
                  />
                </td>
                <td column="Date Created">{ formatDateTime(user.created_at) }</td>
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
    <div className={ this.styler('tableWrapper') }>
      { content }
    </div>
    );
  }

}

UserList.propTypes = {
  initialUsers: React.PropTypes.array,
  initialUserType: React.PropTypes.string,
  initialCurrentUserAccess: React.PropTypes.bool,
  // Set to a function when there should be a remove button.
  onRemove: React.PropTypes.func,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func
};

UserList.defaultProps = {
  initialUsers: [],
  initialUserType: 'space_users',
  initialCurrentUserAccess: false
};
