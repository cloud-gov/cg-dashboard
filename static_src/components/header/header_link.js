import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  children: PropTypes.any,
  url: PropTypes.string,
  text: PropTypes.string,
  classes: PropTypes.array.isRequired
};

const defaultProps = {
  classes: []
};

const HeaderLink = ({ children, url, text, classes }) => (
  <li className="nav-link">
    {children || (
      <a href={url} className={classNames(classes)}>
        {text}
      </a>
    )}
  </li>
);

HeaderLink.propTypes = propTypes;

HeaderLink.defaultProps = defaultProps;

export default HeaderLink;
