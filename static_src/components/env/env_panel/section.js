import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  styler: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

const Section = ({ styler, children }) => (
  <div className={styler('panel-row')}>{children}</div>
);

Section.propTypes = propTypes;

export default Section;
