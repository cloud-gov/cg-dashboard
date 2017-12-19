import PropTypes from "prop-types";
import React from "react";
import { entityHealth } from "../constants.js";
import EntityIcon from "./entity_icon.jsx";

const ICON_TYPES = ["space", "app", "service"];

const propTypes = {
  count: PropTypes.number,
  name: PropTypes.string.isRequired,
  health: PropTypes.oneOf(Object.values(entityHealth)),
  iconType: PropTypes.oneOf(ICON_TYPES)
};

const defaultProps = {
  count: 0,
  health: entityHealth.inactive,
  iconType: "space"
};

export default class CountStatus extends React.Component {
  render() {
    const { health, iconType, count, name } = this.props;

    return (
      <div className={`count_status count_status-${health.toLowerCase()}`}>
        <div className="count_status-icon">
          <EntityIcon entity={iconType} health={health} iconSize="medium" />
        </div>
        <div className="count_status-text">
          <strong>{count}</strong> {name}
        </div>
      </div>
    );
  }
}

CountStatus.propTypes = propTypes;
CountStatus.defaultProps = defaultProps;
