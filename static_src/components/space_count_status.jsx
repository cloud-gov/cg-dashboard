import PropTypes from "prop-types";
import React from "react";
import CountStatus from "./count_status.jsx";

const propTypes = {
  spaces: PropTypes.array
};

const defaultProps = {
  spaces: []
};

export default class SpaceCountStatus extends React.Component {
  render() {
    return <CountStatus count={this.props.spaces.length} name="spaces" />;
  }
}

SpaceCountStatus.propTypes = propTypes;
SpaceCountStatus.defaultProps = defaultProps;
