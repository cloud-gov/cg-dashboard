import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default class PageHeader extends React.Component {
  get actions() {
    if (!this.props.children) {
      return null;
    }

    return <div className="page-header-actions">{this.props.children}</div>;
  }

  render() {
    return (
      <div className="page-header">
        <h1 className="page-header-title test-page-header-title">
          {this.props.title}
        </h1>
        {this.actions}
      </div>
    );
  }
}

PageHeader.propTypes = propTypes;
