
import React from 'react';

const propTypes = {
  userId: React.PropTypes.string.isRequired,
  roleName: React.PropTypes.string.isRequired,
  roleKey: React.PropTypes.string.isRequired,
  initialValue: React.PropTypes.bool,
  initialEnableControl: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

const warningMessage = `Performing this action will remove your ability to adjust user's roles! Are you sure you want to continue?`;

export default class UserRoleControl extends React.Component {
  constructor(props, context) {
    super(props, context);

    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(ev) {
    const { roleKey, onChange } = this.props;
    let shouldContinue = true;

    if (this.props.userId === this.context.currentUser.user_id) {
      shouldContinue = window.confirm(warningMessage);
    }

    if (shouldContinue) {
      onChange(roleKey, ev.target.checked);
    }
  }

  render() {
    const {
      roleKey, roleName, userId, initialValue, initialEnableControl
    } = this.props;
    const inputId = roleKey + userId;

    return (
      <span className="test-user-role-control">
        <label htmlFor={ inputId }>
          <input type="checkbox"
            onChange={ this._handleChange }
            name={ roleKey }
            checked={ initialValue }
            disabled={ !initialEnableControl }
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
  initialValue: false,
  initialEnableControl: false,
  onChange: function() { }
};
