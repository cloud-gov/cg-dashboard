
import PropTypes from 'prop-types';
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';
import { entityHealth } from '../constants.js';
import { appHealth, worstHealth } from '../util/health';

const propTypes = {
  appCount: PropTypes.number,
  apps: PropTypes.array
};

const defaultProps = {
  appCount: 0,
  apps: []
};

export default class AppCountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    let health = entityHealth.inactive;

    if (props.apps.length) {
      health = worstHealth(props.apps.map(appHealth));
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
