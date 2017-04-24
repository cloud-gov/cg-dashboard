
import React from 'react';

export default class UserRoleControl extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      checked: props.initialValue,
      enableControl: props.initialEnableControl
    };
    this._handleChange = this._handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.initialValue,
      enableControl: nextProps.initialEnableControl
    });
  }

  _handleChange(ev) {
    this.props.onChange(ev.target.checked);
  }

  render() {
    return (
      <span className="test-user-role-control">
        <label htmlFor={ this.props.roleKey + this.props.userId }>
          <input type="checkbox"
            onChange={ this._handleChange }
            name={ this.props.roleKey }
            checked={ this.state.checked }
            disabled={ !this.state.enableControl }
            id={ this.props.roleKey + this.props.userId }
          />
          { this.props.roleName }
        </label>
      </span>
    );
  }
}
UserRoleControl.propTypes = {
  roleName: React.PropTypes.string.isRequired,
  roleKey: React.PropTypes.string.isRequired,
  initialValue: React.PropTypes.bool,
  initialEnableControl: React.PropTypes.bool,
  onChange: React.PropTypes.func
};
UserRoleControl.defaultProps = {
  initialValue: false,
  initialEnableControl: false,
  onChange: function() { }
}
