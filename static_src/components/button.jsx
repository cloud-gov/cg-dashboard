
import React from 'react';

import classNames from 'classnames';

function stateSetter() {
  return {};
}

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(ev) {
    return this.props.onClickHandler(ev);
  }

  render() {
    const classes = classNames(...this.props.classes);
    const type = this.props.type;
    return (
      <button type={ type } className={ classes }
          aria-label={ this.props.label } onClick={ this._handleClick }
          disabled={this.props.disabled}>
        { this.props.children }
      </button>
    );
  }
}

Button.propTypes = {
  classes: React.PropTypes.array,
  label: React.PropTypes.string,
  onClickHandler: React.PropTypes.func,
  type: React.PropTypes.string,
  disabled: React.PropTypes.bool
};

Button.defaultProps = {
  classes: [],
  disabled: false,
  label: '',
  onClickHandler: () => true,
  type: 'button'
};
