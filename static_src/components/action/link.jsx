import React from 'react';
import classnames from 'classnames';

const propTypes = {
  children: React.PropTypes.any,
  className: React.PropTypes.string,
  clickHandler: React.PropTypes.func,
  href: React.PropTypes.string,
  label: React.PropTypes.string
};
const defaultHref = '#';

const Link = ({ className, label, href, clickHandler, children }) =>
  <a
    className={ classnames(className, 'action-link') }
    title={ label }
    onClick={ clickHandler }
    href={ href || defaultHref }
  >
    { children }
  </a>;

Link.propTypes = propTypes;

export default Link;
