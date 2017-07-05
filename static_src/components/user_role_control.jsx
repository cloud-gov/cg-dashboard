
import React from 'react';

const propTypes = {
  userId: React.PropTypes.string.isRequired,
  roleName: React.PropTypes.string.isRequired,
  roleKey: React.PropTypes.string.isRequired,
  value: React.PropTypes.bool,
  enableControl: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

const dangerousRole = 'org_manager';

const warningMessage = 'Performing this action will remove your ability to adjust user roles! Are you sure you want to continue?';

export default class UserRoleControl extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._handleChange = this._handleChange.bind(this);
  }

  userSelfRemovingOrgManager(role, removing) {
    const { userId } = this.props;
    const currentUserId = this.context.currentUser.user_id;

    return userId === currentUserId && role === dangerousRole && removing;
  }

  _handleChange(ev) {
    const { roleKey, onChange } = this.props;
    const { checked, name } = ev.target;
    let shouldContinue = true;

    if (this.userSelfRemovingOrgManager(name, !checked)) {
      shouldContinue = window.confirm(warningMessage);
    }

    if (shouldContinue) {
      onChange(roleKey, checked);
    }
  }

  render() {
    const {
      roleKey, roleName, userId, value, enableControl
    } = this.props;
    const inputId = roleKey + userId;

    return (
      <span className="test-user-role-control">
        <label htmlFor={ inputId }>
          <input type="checkbox"
            onChange={ this._handleChange }
            name={ roleKey }
            checked={ value }
            disabled={ !enableControl }
            id={ inputId }
          />
          { roleName }
        </label>
      </span>
    );
  }
};

UserRoleControl.contextTypes = {
  currentUser: React.PropTypes.object
};

UserRoleControl.propTypes = propTypes;
UserRoleControl.defaultProps = {
  value: false,
  enableControl: false,
  onChange: function() { }
};
