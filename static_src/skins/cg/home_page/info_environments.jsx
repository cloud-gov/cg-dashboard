import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ""
};

const InfoEnvironment = ({ className }) => <section className={className} />;

InfoEnvironment.propTypes = propTypes;

InfoEnvironment.defaultProps = defaultProps;

export default InfoEnvironment;
