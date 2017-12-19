import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  columns: PropTypes.number,
  children: PropTypes.any
};
const defaultProps = {
  columns: 0,
  children: null
};

export default class PanelGroup extends React.Component {
  render() {
    let gridClass = "";
    if (this.props.columns !== 0) {
      gridClass = `grid-width-${this.props.columns}`;
    }
    return (
      <div className={`panel-group ${gridClass}`}>{this.props.children}</div>
    );
  }
}

PanelGroup.propTypes = propTypes;
PanelGroup.defaultProps = defaultProps;
