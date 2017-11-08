import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  clickHandler: PropTypes.func,
  href: PropTypes.string,
  label: PropTypes.string
};
const defaultHref = "#";

const Link = ({ className, label, href, clickHandler, children }) => (
  <a
    className={classnames(className, "action-link")}
    title={label}
    onClick={clickHandler}
    href={href || defaultHref}
  >
    {children}
  </a>
);

Link.propTypes = propTypes;

export default Link;
