
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
    var classes = classNames(...this.props.classes);
    return (
      <button type="button" className={ classes }
          aria-label={ this.props.label } onClick={ this._handleClick }>
        { this.props.children }
      </button>
    );
  }
}

Button.propTypes = {
  classes: React.PropTypes.array,
  label: React.PropTypes.string,
  onClickHandler: React.PropTypes.func
};

Button.defaultProps = {
  classes: [],
  label: '',
  onClickHandler: function() { return true; }
};
