import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  testLabel: PropTypes.string
};

const BreadcrumbsItem = ({ children, href, testLabel }) => (
  <li className="breadcrumbs-item">
    {href ? (
      <a className="breadcrumbs-item-link" href={href} data-test={testLabel}>
        {children}
      </a>
    ) : (
      <span className="breadcrumbs-item-current" data-test={testLabel}>
        {children}
      </span>
    )}
  </li>
);

BreadcrumbsItem.propTypes = propTypes;

export default BreadcrumbsItem;
