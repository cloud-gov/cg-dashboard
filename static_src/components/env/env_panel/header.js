import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.any.isRequired
};

const Header = ({ children }) => (
  <header>
    <h4 className="panel-row-header">{children}</h4>
  </header>
);

Header.propTypes = propTypes;

export default Header;
