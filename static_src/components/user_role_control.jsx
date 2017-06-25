
import React from 'react';

const propTypes = {
  userId: React.PropTypes.string.isRequired,
  roleName: React.PropTypes.string.isRequired,
  roleKey: React.PropTypes.string.isRequired,
  initialValue: React.PropTypes.bool,
  initialEnableControl: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

export default class UserRoleControl extends React.Component {
  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(ev) {
    const { roleKey, onChange } = this.props;
    onChange(roleKey, ev.target.checked);
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

UserRoleControl.propTypes = propTypes;
UserRoleControl.defaultProps = {
  initialValue: false,
  initialEnableControl: false,
  onChange: function() { }
};
