
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';
import { appStates } from '../constants.js';

const propTypes = {
  appCount: React.PropTypes.number,
  apps: React.PropTypes.array
};

const defaultProps = {
  appCount: 0,
  apps: []
};

const APP_STATES_RANKED = [
  appStates.default,
  appStates.restarting,
  appStates.running,
  appStates.started,
  appStates.stopped,
  appStates.crashed
];

function rankWorseState(state) {
  return APP_STATES_RANKED.indexOf(state);
}

export default class AppCountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  worstStatus(apps) {
    return apps.reduce((previousState, app) => {
      if (rankWorseState(previousState) < rankWorseState(app.state)) {
        return app.state;
      }
      return previousState;
    }, 'NONE');
  }

  render() {
    const props = this.props;
    let status = 'NONE';

    if (props.apps.length) {
      status = this.worstStatus(props.apps);
    }

    return <CountStatus count={ props.appCount } name="apps" status={ status } />;
  }
}

AppCountStatus.propTypes = propTypes;
AppCountStatus.defaultProps = defaultProps;
