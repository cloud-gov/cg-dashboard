import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  children: PropTypes.array
};
const defaultProps = {
  children: null
};

export default class ElasticLine extends React.Component {
  render() {
    return <div className="elastic_line">{this.props.children}</div>;
  }
}

ElasticLine.propTypes = propTypes;
ElasticLine.defaultProps = defaultProps;
