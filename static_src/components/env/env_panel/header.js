import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  styler: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

const Header = ({ styler, children }) => (
  <header>
    <h4 className={styler('panel-row-header')}>{children}</h4>
  </header>
);

Header.propTypes = propTypes;

export default Header;
