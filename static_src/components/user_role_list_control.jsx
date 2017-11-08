import PropTypes from "prop-types";
/*
 * Renders a users roles with controls to edit them
 */

import React from "react";

import ElasticLine from "./elastic_line.jsx";
import ElasticLineItem from "./elastic_line_item.jsx";
import UserRoleControl from "./user_role_control.jsx";

// roleMapping is a centralized relation of roles to machine-readable fields.
// The root contains which level of users are we referring to.
// Currently in CF, there are only two levels. space_user and org_users.
// Each root node contains an array objects to specify various fields.
// Each object will contain the following 3 fields:
//
// 1) key
// 'key' is useful for two reasons. One: When the app checks for the roles in the
// space via https://apidocs.cloudfoundry.org/263/spaces/retrieving_the_roles_of_all_users_in_the_space.html
// or in the
// org via https://apidocs.cloudfoundry.org/263/organizations/retrieving_the_roles_of_all_users_in_the_organization.html
// it will compare the roles returned with the value of 'key'.
// the second reason is because 'key is used in the rendering of the user list.
// the HTML element ID set as the 'key' + 'userguid'.
//
// 2) apiKey
// 'apiKey' is needed because the API to associate/dissociate roles does not use
// the same key as 'key'.
// For example to associate a developer to a space:
// https://apidocs.cloudfoundry.org/263/spaces/associate_developer_with_the_space.html
// It uses 'developers' instead of 'space_developer'.
//
// 3) label
// 'label' is a human-readable version of the role.
const roleMapping = {
  space_users: [
    { key: "space_developer", apiKey: "developers", label: "Space Developer" },
    { key: "space_manager", apiKey: "managers", label: "Space Manager" },
    { key: "space_auditor", apiKey: "auditors", label: "Space Auditor" }
  ],
  org_users: [
    { key: "org_manager", apiKey: "managers", label: "Org Manager" },
    {
      key: "billing_manager",
      apiKey: "billing_managers",
      label: "Billing Manager"
    },
    { key: "org_auditor", apiKey: "auditors", label: "Org Auditor" }
  ]
};

const propTypes = {
  user: PropTypes.object.isRequired,
  userType: PropTypes.string,
  currentUserAccess: PropTypes.bool,
  entityGuid: PropTypes.string,
  onRemovePermissions: PropTypes.func,
  onAddPermissions: PropTypes.func
};

const defaultProps = {
  userType: "space_users",
  currentUserAccess: false,
  onRemovePermissions: function defaultRemove() {},
  onAddPermissions: function defaultAdd() {}
};

export default class UserRoleListControl extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  checkRole(roleKey) {
    return this.roles().indexOf(roleKey) > -1;
  }

  _onChange(roleKey, checked) {
    const handler = !checked
      ? this.props.onRemovePermissions
      : this.props.onAddPermissions;
    const apiKey = this.roleMap.filter(role => role.key === roleKey)[0].apiKey;

    handler(roleKey, apiKey, this.props.user.guid);
  }

  roles() {
    let roles;
    if (this.props.userType == "space_users") {
      roles = this.props.user.space_roles;
    } else {
      roles = this.props.user.roles;
    }
    return roles ? roles[this.props.entityGuid] || [] : [];
  }

  get roleMap() {
    return roleMapping[this.props.userType];
  }

  render() {
    return (
      <span className="test-user-roles-list-control">
        <ElasticLine>
          {this.roleMap.map(role => (
            <ElasticLineItem key={role.key}>
              <UserRoleControl
                roleName={role.label}
                roleKey={role.key}
                value={this.checkRole(role.key)}
                enableControl={this.props.currentUserAccess}
                onChange={this._onChange}
                userId={this.props.user.guid}
              />
            </ElasticLineItem>
          ))}
        </ElasticLine>
      </span>
    );
  }
}

UserRoleListControl.propTypes = propTypes;
UserRoleListControl.defaultProps = defaultProps;
