import PropTypes from "prop-types";
import React from "react";
import CountStatus from "./count_status.jsx";
import ServiceInstanceStore from "../stores/service_instance_store.js";
import { entityHealth } from "../constants.js";
import { appInstanceHealth, worstAppInstanceState } from "../util/health";

const propTypes = {
  serviceCount: PropTypes.number,
  services: PropTypes.array
};

const defaultProps = {
  serviceCount: 0,
  services: []
};

export default class ServiceCountStatus extends React.Component {
  render() {
    const props = this.props;
    let health = entityHealth.inactive;

    if (props.services.length) {
      health = appInstanceHealth(
        worstAppInstanceState(
          props.services.map(si => ServiceInstanceStore.getMappedAppState(si))
        )
      );
    }

    return (
      <CountStatus
        count={props.serviceCount}
        name="services"
        health={health}
        iconType="service"
      />
    );
  }
}

ServiceCountStatus.propTypes = propTypes;
ServiceCountStatus.defaultProps = defaultProps;
