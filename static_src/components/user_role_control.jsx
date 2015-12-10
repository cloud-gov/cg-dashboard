
import React from 'react';

export default class UserRoleControl extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      checked: props.initialValue
    };
  }

  _handleChange = (ev) => {
    this.props.onChange(ev.target.checked);
    this.setState({ checked: ev.target.checked });
  }

  render() {
    return (
      <span>
        <input type="checkbox" 
          onClick={ this._handleChange }
          name={ this.props.roleKey }
          checked={ this.state.checked }
        />
        { this.props.roleName }
      </span>
    );
  }
}
UserRoleControl.propTypes = {
  roleName: React.PropTypes.string.isRequired,
  roleKey: React.PropTypes.string.isRequired,
  initialValue: React.PropTypes.bool,
  onChange: React.PropTypes.func
};
UserRoleControl.defaultProps = {
  initialValue: false,
  onChange: function() { }
}
