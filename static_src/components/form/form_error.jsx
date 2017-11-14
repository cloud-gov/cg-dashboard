import PropTypes from "prop-types";
import React from "react";

const propTypes = { message: PropTypes.string };
const defaultProps = { message: "" };

const FormError = ({ message }) => (
  <span className="error_message">{message}</span>
);

FormError.propTypes = propTypes;
FormError.defaultProps = defaultProps;

export default FormError;
