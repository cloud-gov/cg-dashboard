
/**
 * Renders a list of users.
 */

import React from 'react';

import Button from './button.jsx';
import UserRoleListControl from './user_role_list_control.jsx';


export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      users: props.initialUsers
    };
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({users: nextProps.initialUsers});
  }

  _handleDelete(userGuid, ev) {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    var columns = [
      { label: 'Name', key: 'username' },
      { label: 'Date Created', key: 'created_at' }
    ];

    if (this.props.onRemove) {
      columns.push({ label: 'Actions', key: 'actions' });
    }

    return columns;
  }

  render() {
    var content = <h4 className="test-none_message">No users</h4>;
    if (this.state.users.length) {
      content = (
      <table sortable={ true } className="table">
        <thead>
          { this.columns.map((column) => {
            return (
              <th column={ column.label } className={ column.key }
                  key={ column.key }>
                { column.label }</th>
            )
          })}
        </thead>
        <tbody>
        { this.state.users.map((user) => {
          var actions;
          if (this.props.onRemove) {
            actions = (
              <td column="Actions">
                <Button 
                onClickHandler={ this._handleDelete.bind(this, user.guid) } 
                label="delete">
                  <span>Remove User From Org</span>
                </Button>
                </td>
            );
          } 
          return ([
            <tr key={ user.guid }>
              <td column="Name"><span>{ user.username }</span></td>
              <td column="Date Created">{ user.created_at }</td>
              { actions }
            </tr>,
            <tr key={ user.guid + '-role' }>
              <td colSpan="2">
                <UserRoleListControl 
                  onAddPermissions={ this.props.onAddPermissions }
                  onRemovePermissions={ this.props.onRemovePermissions }
                  user={ user } 
                />
              </td>
            </tr>
          ])
        })}
        </tbody>
      </table>
      );
    }

    return (
    <div className="tableWrapper"> 
      { content }
    </div>
    );
  }

};

UserList.propTypes = {
  initialUsers: React.PropTypes.array,
  // Set to a function when there should be a remove button.
  onRemove: React.PropTypes.func,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func
};

UserList.defaultProps = {
  initialUsers: []
}
