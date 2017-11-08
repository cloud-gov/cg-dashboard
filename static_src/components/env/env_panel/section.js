import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.any.isRequired
};

const Section = ({ children }) => <div className="panel-row">{children}</div>;

Section.propTypes = propTypes;

export default Section;
