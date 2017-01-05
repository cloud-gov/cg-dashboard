
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import { entityHealth } from '../constants.js';
import { worstHealth } from '../util/health';


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

  render() {
    const props = this.props;
    let health = entityHealth.inactive;

    if (props.services.length) {
      health = worstHealth(
	props.services.map(ServiceInstanceStore.getMappedAppState.bind(ServiceInstanceStore))
      );
    }

    return (
      <CountStatus count={ props.serviceCount } name="services"
        health={ health } iconType="service"
      />
    );
  }
}

ServiceCountStatus.propTypes = propTypes;
ServiceCountStatus.defaultProps = defaultProps;
