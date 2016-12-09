
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import { appStates } from '../constants.js';

const STATES_RANKED = [
  appStates.stopped,
  appStates.running,
  appStates.crashed
];

function rankWorseState(state) {
  return STATES_RANKED.indexOf(state);
}

const propTypes = {
  serviceCount: React.PropTypes.number,
  services: React.PropTypes.array
};

const defaultProps = {
  serviceCount: 0,
  services: []
};

export default class ServiceCountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  worstStatus(services) {
    return services.reduce((previousState, service) => {
      const serviceState = ServiceInstanceStore.getMappedAppState(service);
      if (rankWorseState(previousState) < rankWorseState(serviceState)) {
        return serviceState;
      }
      return previousState;
    }, appStates.stopped);
  }

  render() {
    const props = this.props;
    let status = appStates.stopped;

    if (props.services.length) {
      this.worstStatus(props.services);
    }

    return (
      <CountStatus count={ props.serviceCount } name="services"
        status={ status } iconType="service"
      />
    );
  }
}

ServiceCountStatus.propTypes = propTypes;
ServiceCountStatus.defaultProps = defaultProps;
