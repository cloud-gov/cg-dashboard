
/**
 * Renders a list of users.
 */

import React from 'react';

import Action from './action.jsx';
import ComplexList from './complex_list.jsx';
import ComplexListItem from './complex_list_item.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import EntityEmpty from './entity_empty.jsx';
import Loading from './loading.jsx';
import PanelDocumentation from './panel_documentation.jsx';
import UserRoleListControl from './user_role_list_control.jsx';
import createStyler from '../util/create_styler';
import { config } from 'skin';
import formatDateTime from '../util/format_date';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter(props) {
  return {
    users: props.initialUsers,
    userType: props.initialUserType,
    currentUserAccess: props.initialCurrentUserAccess,
    empty: props.initialEmpty,
    saving: props.initialSaving,
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

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          { this.userTypePretty } Managers can change these roles. For details
            about these roles, see <a href="https://docs.cloudfoundry.org/concepts/roles.html#roles">Cloud Foundry roles and permissions</a>.
          { config.docs.invite_user &&
            <span> To invite a user and give them roles, see <a href={ config.docs.invite_user }>Managing Teammates</a>.
            </span>
          }
        </p>
      </PanelDocumentation>
    );
  }

  get emptyState() {
    const callout = `There are no users in this ${this.userTypePretty.toLowerCase()}`;
    const content = config.docs.invite_user &&
      <a href={ config.docs.invite_user }>Read more about adding users to this space.</a>

    return (
      <EntityEmpty callout={ callout }>
        { content }
      </EntityEmpty>
    );
  }

  get onlyOneState() {
    let content;
    const callout = `You are the only user in this ${this.userTypePretty.toLowerCase()}`;

    if (this.state.userType === 'org_users') {
      const readMore = config.docs.invite_user &&
        <a href={ config.docs.invite_user }>Read more about inviting new users.</a>

      content = (
        <p>
          You can invite teammates to get cloud.gov accounts. You can invite
          anyone you need to work with, including federal employees and
          federal contractors. { readMore }
        </p>
      );
    } else {
      const content = config.docs.invite_user &&
        <a href={ config.docs.invite_user }>Read more about adding users to this space.</a>
    }

    return (
      <EntityEmpty callout={ callout }>
        { content }
      </EntityEmpty>
    );
  }

  render() {
    let saving;
    let loading = <Loading text="Loading users" />;
    let content = <div>{ loading }</div>;

    if (this.state.saving) {
      saving = <Saving text={this.state.saving} />;
    }

    if (this.state.empty) {
      content = this.emptyState;
    } else if (this.state.users.length === 1) {
      content = this.onlyOneState;
    } else if (!this.state.loading && this.state.users.length) {
      content = (
      <div className="test-user_list">
        { saving }
        { this.documentation }
        <ComplexList>
          { this.state.users.map((user) => {
            let actions;
            if (this.props.onRemove) {
              let button = <span></span>;
              if (this.state.currentUserAccess) {
                button = (
                  <Action
                    style="base"
                    clickHandler={ this._handleDelete.bind(this, user.guid) }
                    label="delete">
                    <span>Remove User From Org</span>
                  </Action>
                );
              }
              actions = (
                <ElasticLineItem align="end">
                  { button }
                </ElasticLineItem>
              );
            }
            return (
              <ElasticLine key={ user.guid }>
                <ElasticLineItem>{ user.username }</ElasticLineItem>
                <ElasticLineItem key={ `${user.guid}-role` } align="end">
                  <UserRoleListControl
                    initialUserType={ this.state.userType }
                    initialCurrentUserAccess={ this.state.currentUserAccess }
                    onAddPermissions={ this.props.onAddPermissions }
                    onRemovePermissions={ this.props.onRemovePermissions }
                    user={ user }
                  />
                </ElasticLineItem>
                { actions }
              </ElasticLine>
              );
          })}
        </ComplexList>
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
  initialEmpty: React.PropTypes.bool,
  initialLoading: React.PropTypes.bool,
  initialSaving: React.PropTypes.bool,
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
  initialSaving: false,
  initialLoading: false
};
