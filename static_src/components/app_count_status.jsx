
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';

const propTypes = {
  appCount: React.PropTypes.number,
  apps: React.PropTypes.array
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

    return <CountStatus count={ props.appCount } name="apps" />
  }
}

AppCountStatus.propTypes = propTypes;
AppCountStatus.defaultProps = defaultProps;
