/*
 * Renders a users roles with controls to edit them
 */

import React from 'react';

import UserRoleControl from './user_role_control.jsx';

const roleMapping = {
  space_users: [
    { key: 'space_developer', label: 'Space Developer' },
    { key: 'space_manager', label: 'Space Manager' },
    { key: 'space_auditor', label: 'Space Auditor' }
  ],
  org_users: [
    { key: 'org_manager', label: 'Org Manager' },
    { key: 'billing_manager', label: 'Billing Manager' },
    { key: 'org_auditor', label: 'Org Auditor' }
  ]

};

const roleToResource = {
  org_manager: 'managers',
  billing_manager: 'billing_managers',
  org_auditor: 'auditors',
  space_developer: 'developers',
  space_manager: 'managers',
  space_auditor: 'auditors'
};

export default class UserRoleListControl extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: props.user,
      userType: props.initialUserType,
      currentUserAccess: props.initialCurrentUserAccess
    };
    this._onChange = this._onChange.bind(this);
    this.checkRole = this.checkRole.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      userType: nextProps.initialUserType,
      currentUserAccess: nextProps.initialCurrentUserAccess
    });
  }

  checkRole(roleKey) {
    return (this.roles.indexOf(roleKey) > -1);
  }

  _onChange(roleKey, checked) {
    const handler = (!checked) ? this.props.onRemovePermissions :
      this.props.onAddPermissions;
    const resource = roleToResource[roleKey];

    handler(resource, this.props.user.guid);
  }

  get roles() {
    const rolesOnType = (this.state.userType === 'space_users') ?
      this.props.user.space_roles :
      this.props.user.organization_roles;
    return rolesOnType || [];
  }

  get roleMap() {
    return roleMapping[this.state.userType];
  }


  render() {
    return (
      <div>
      { this.roleMap.map((role) =>
        <span key={ role.key }>
          <UserRoleControl
            roleName={ role.label }
            roleKey={ role.key }
            initialValue={ this.checkRole(role.key) }
            initialEnableControl={ this.state.currentUserAccess }
            onChange={ this._onChange.bind(this, role.key) }
            userId={ this.props.user.guid }
          />
        </span>
      )}
      </div>
    );
  }
}
UserRoleListControl.propTypes = {
  user: React.PropTypes.object.isRequired,
  initialUserType: React.PropTypes.string,
  initialCurrentUserAccess: React.PropTypes.bool,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func,
};
UserRoleListControl.defaultProps = {
  initialUserType: 'space_users',
  initialCurrentUserAccess: false,
  onRemovePermissions: function defaultRemove() { },
  onAddPermissions: function defaultAdd() { }
};
