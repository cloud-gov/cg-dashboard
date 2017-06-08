/*
 * Renders a users roles with controls to edit them
 */

import React from 'react';

import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
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

const propTypes = {
  user: React.PropTypes.object.isRequired,
  userType: React.PropTypes.string,
  currentUserAccess: React.PropTypes.bool,
  entityGuid: React.PropTypes.string,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func,
};

const defaultProps = {
  userType: 'space_users',
  currentUserAccess: false,
  onRemovePermissions: function defaultRemove() { },
  onAddPermissions: function defaultAdd() { }
};

export default class UserRoleListControl extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this._onChange = this._onChange.bind(this);
    this.checkRole = this.checkRole.bind(this);
  }

  checkRole(roleKey) {
    return (this.roles().indexOf(roleKey) > -1);
  }

  _onChange(roleKey, checked) {
    const handler = (!checked) ? this.props.onRemovePermissions :
      this.props.onAddPermissions;
    const resource = roleToResource[roleKey];

    handler(resource, this.props.user.guid);
  }

  roles() {
    const roles = this.props.user.roles;
    if (!roles) return [];
    return roles ?
      (roles[this.props.entityGuid] || []) :
      []
  }

  get roleMap() {
    return roleMapping[this.props.userType];
  }


  render() {
    return (
      <span className="test-user-roles-list-control">
        <ElasticLine>
        { this.roleMap.map((role) =>
          <ElasticLineItem key={ role.key }>
            <UserRoleControl
              roleName={ role.label }
              roleKey={ role.key }
              initialValue={ this.checkRole(role.key) }
              initialEnableControl={ this.props.currentUserAccess }
              onChange={ this._onChange.bind(this, role.key) }
              userId={ this.props.user.guid }
            />
          </ElasticLineItem>
        )}
        </ElasticLine>
      </span>
    );
  }
}
UserRoleListControl.propTypes = propTypes;
UserRoleListControl.defaultProps = defaultProps;
