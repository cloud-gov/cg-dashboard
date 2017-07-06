import React from 'react';

const propTypes = {
  children: React.PropTypes.any,
  className: React.PropTypes.string,
  clickHandler: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  label: React.PropTypes.string,
  type: React.PropTypes.string
};

const button = ({ className, label, clickHandler, disabled, type, children }) =>
  <button
    className={ className }
    aria-label={ label }
    onClick={ clickHandler }
    disabled={ disabled }
    type={type}
  >
    { children }
  </button>;

button.propTypes = propTypes;

export default button;
