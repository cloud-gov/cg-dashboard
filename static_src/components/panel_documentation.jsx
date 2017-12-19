import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

const propTypes = {
  children: PropTypes.any,
  description: PropTypes.bool
};
const defaultProps = {
  children: null,
  description: false
};

export default class PanelDocumentation extends React.Component {
  render() {
    const classes = classNames("panel-documentation", {
      "panel-documentation-desc": this.props.description
    });

    return <div className={classes}>{this.props.children}</div>;
  }
}

PanelDocumentation.propTypes = propTypes;
PanelDocumentation.defaultProps = defaultProps;
