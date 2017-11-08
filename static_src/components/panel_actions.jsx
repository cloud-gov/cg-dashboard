import PropTypes from "prop-types";
import React from "react";

const ALIGN_TYPES = ["left", "right", "both"];

const propTypes = {
  children: PropTypes.any,
  align: PropTypes.oneOf(ALIGN_TYPES)
};
const defaultProps = {
  children: [],
  align: ALIGN_TYPES[0]
};

export default class PanelActions extends React.Component {
  render() {
    return (
      <span className={`panel-actions panel-actions-${this.props.align}`}>
        {this.props.children}
      </span>
    );
  }
}

PanelActions.propTypes = propTypes;
PanelActions.defaultProps = defaultProps;
