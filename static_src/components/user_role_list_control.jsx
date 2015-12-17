/*
 * Renders a users roles with controls to edit them
 */

import React from 'react';

import UserRoleControl from './user_role_control.jsx';

const roles = [
  { key: 'org_manager', label: 'Org Manager' },
  { key: 'billing_manager', label: 'Billing Manager' },
  { key: 'org_auditor', label: 'Org Auditor' }
];

const roleToResource = {
  'org_manager': 'managers',
  'billing_manager': 'billing_managers',
  'org_auditor': 'auditors'
}

export default class UserRoleListControl extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this._onChange = this._onChange.bind(this);
    this.checkRole = this.checkRole.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: nextProps.users});
  }

  checkRole(roleKey) {
    return (this.roles.indexOf(roleKey) > -1);
  }

  _onChange(roleKey, checked) {
    var handler = (!checked) ? this.props.onRemovePermissions : 
      this.props.onAddPermissions;
    var resource = roleToResource[roleKey];

    handler(resource, this.props.user.guid);
  }

  get roles() {
    return this.props.user.organization_roles || [];
  }


  render() {
    return (
      <div>
      { roles.map((role) => {
        return (
          <span key={ role.key }>
            <UserRoleControl 
              roleName={ role.label }
              roleKey={ role.key }
              initialValue={ this.checkRole(role.key) }
              onChange={ this._onChange.bind(this, role.key) }
            />
          </span>
        );
      })}
      </div>
    );
  }
}
UserRoleListControl.propTypes = {
  user: React.PropTypes.object.isRequired,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func
};
UserRoleListControl.defaultProps = {
  onRemovePermissions: function() { },
  onAddPermissions: function() { }
}
