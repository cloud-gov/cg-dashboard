
import React from 'react';

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
    return (
      <button type="button" className="btn btn-default" 
          aria-label={ this.props.label } onClick={ this._handleClick }>
        { this.props.children }
      </button>
    );
  }
}

Button.propTypes = {
  label: React.PropTypes.string,
  onClickHandler: React.PropTypes.func
};

Button.defaultProps = {
  label: '',
  onClickHandler: function() { return true; }
};
