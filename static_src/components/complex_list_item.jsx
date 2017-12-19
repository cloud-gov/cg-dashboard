import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  children: PropTypes.any
};

const defaultProps = {};

export default class ComplexListItem extends React.Component {
  render() {
    return <div className="complex_list-item">{this.props.children}</div>;
  }
}

ComplexListItem.propTypes = propTypes;
ComplexListItem.defaultProps = defaultProps;
