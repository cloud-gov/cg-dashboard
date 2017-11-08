import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  clickHandler: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string
};

const button = ({
  className,
  label,
  clickHandler,
  disabled,
  type,
  children
}) => (
  <button
    className={className}
    aria-label={label}
    onClick={clickHandler}
    disabled={disabled}
    type={type}
  >
    {children}
  </button>
);

button.propTypes = propTypes;

export default button;
