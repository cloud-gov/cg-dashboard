
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';
import { entityHealth } from '../constants.js';
import { appHealth } from '../util/health';

const propTypes = {
  appCount: React.PropTypes.number,
  apps: React.PropTypes.array
};

const defaultProps = {
  appCount: 0,
  apps: []
};

const APP_HEALTH_RANKED = [
  entityHealth.error,
  entityHealth.warning,
  entityHealth.ok,
  entityHealth.inactive
];

// Lowest score is worst
// Unknown health is worst (-1)
function rankWorseHealth(state) {
  return APP_HEALTH_RANKED.indexOf(state);
}

export default class AppCountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  worstHealth(apps) {
    return apps.reduce((worstHealth, app) => {
      const health = appHealth(app);
      if (rankWorseHealth(worstHealth) > rankWorseHealth(health)) {
        return health;
      }

      return worstHealth;
    }, entityHealth.inactive);
  }

  render() {
    const props = this.props;
    let health = entityHealth.inactive;

    if (props.apps.length) {
      health = this.worstHealth(props.apps);
    }

    return (
      <CountStatus count={ props.appCount } name="apps"
        health={ health } iconType="app"
      />
    );
  }
}

AppCountStatus.propTypes = propTypes;
AppCountStatus.defaultProps = defaultProps;
