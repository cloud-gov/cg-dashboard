import PropTypes from "prop-types";
/**
 * Renders a list of users.
 */

import React from "react";

import Action from "./action.jsx";
import ComplexList from "./complex_list.jsx";
import ComplexListItem from "./complex_list_item.jsx";
import ElasticLine from "./elastic_line.jsx";
import ElasticLineItem from "./elastic_line_item.jsx";
import EntityEmpty from "./entity_empty.jsx";
import Loading from "./loading.jsx";
import PanelDocumentation from "./panel_documentation.jsx";
import UserRoleListControl from "./user_role_list_control.jsx";
import { config } from "skin";
import formatDateTime from "../util/format_date";

const propTypes = {
  users: PropTypes.array,
  userType: PropTypes.string,
  entityGuid: PropTypes.string,
  currentUserAccess: PropTypes.bool,
  empty: PropTypes.bool,
  loading: PropTypes.bool,
  saving: PropTypes.bool,
  savingText: PropTypes.string,
  // Set to a function when there should be a remove button.
  onRemove: PropTypes.func,
  onRemovePermissions: PropTypes.func,
  onAddPermissions: PropTypes.func
};

const defaultProps = {
  users: [],
  userType: "space_users",
  currentUserAccess: false,
  saving: false,
  savingText: "",
  empty: false,
  loading: false
};

export default class UserList extends React.Component {
  constructor(props) {
    super(props);

    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleDelete(userGuid, ev) {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    const columns = [
      { label: "User Name", key: "username" },
      { label: "Roles", key: "permissions" },
      { label: "Date Created", key: "created_at" }
    ];

    if (this.props.onRemove) {
      columns.push({ label: "Actions", key: "actions" });
    }

    return columns;
  }

  get userTypePretty() {
    return this.props.userType === "org_users" ? "Organization" : "Space";
  }

  get inviteDocumentation() {
    if (!config.docs.invite_user) return null;

    return (
      <span>
        To invite a user and give them roles, see{" "}
        <a href={config.docs.invite_user}>Managing Teammates</a>.&nbsp;
        <b>
          Removing all roles does not remove a user from an organization. Users
          with no roles can view other users and their roles while being unable
          to make any changes.
        </b>
      </span>
    );
  }

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          {this.userTypePretty} Managers can change these roles. For details
          about these roles, see{" "}
          <a href="https://docs.cloudfoundry.org/concepts/roles.html#roles">
            Cloud Foundry roles and permissions
          </a>.
          {this.inviteDocumentation}
        </p>
      </PanelDocumentation>
    );
  }

  get emptyState() {
    const callout = `There are no users in this ${this.userTypePretty.toLowerCase()}`;
    const content = config.docs.invite_user && (
      <a href={config.docs.invite_user}>
        Read more about adding users to this space.
      </a>
    );

    return <EntityEmpty callout={callout}>{content}</EntityEmpty>;
  }

  render() {
    let buttonText;
    let content = (
      <div>
        <Loading text="Loading users" />
      </div>
    );

    if (this.props.empty) {
      content = this.emptyState;
    } else if (!this.props.loading && this.props.users.length) {
      content = (
        <div className="test-user_list">
          <Loading
            active={this.props.saving}
            loadingDelayMS={0}
            text="Saving"
            style="globalSaving"
          />
          {this.documentation}
          <ComplexList>
            {this.props.users.map(user => {
              let actions;
              if (this.props.onRemove) {
                let button = <span />;
                if (this.props.currentUserAccess) {
                  if (this.props.userType === "org_users") {
                    buttonText = "Remove User From Org";
                  } else if (this.props.userType === "space_users") {
                    buttonText = "Remove All Space Roles";
                  }
                  button = (
                    <Action
                      style="base"
                      clickHandler={this._handleDelete.bind(this, user.guid)}
                      label="delete"
                    >
                      <span>{buttonText}</span>
                    </Action>
                  );
                }
                actions = (
                  <ElasticLineItem align="end">{button}</ElasticLineItem>
                );
              }

              return (
                <ElasticLine key={user.guid}>
                  <ElasticLineItem>{user.username}</ElasticLineItem>
                  <ElasticLineItem key={`${user.guid}-role`} align="end">
                    <UserRoleListControl
                      userType={this.props.userType}
                      currentUserAccess={this.props.currentUserAccess}
                      onAddPermissions={this.props.onAddPermissions}
                      onRemovePermissions={this.props.onRemovePermissions}
                      entityGuid={this.props.entityGuid}
                      user={user}
                    />
                  </ElasticLineItem>
                  {actions}
                </ElasticLine>
              );
            })}
          </ComplexList>
        </div>
      );
    }

    return <div className="tableWrapper">{content}</div>;
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;
