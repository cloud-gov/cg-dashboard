import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  children: PropTypes.any
};
const defaultProps = {
  children: null
};

export default class PanelBlock extends React.Component {
  render() {
    return <div className="panel-block">{this.props.children}</div>;
  }
}

PanelBlock.propTypes = propTypes;
PanelBlock.defaultProps = defaultProps;
