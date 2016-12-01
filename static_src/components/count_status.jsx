
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import { appStates } from '../constants.js';

const ICON_TYPES = [
  'space',
  'app'
];

const propTypes = {
  count: React.PropTypes.number,
  name: React.PropTypes.string.isRequired,
  status: React.PropTypes.oneOf(Object.values(appStates)),
  iconType: React.PropTypes.oneOf(ICON_TYPES)
};

const defaultProps = {
  count: 0,
  status: appStates.none,
  iconType: 'space'
};

export default class CountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const statusClass = `count_status-${props.status.toLowerCase()}`;

    return (
      <span className={ this.styler('count_status', statusClass) }>
        <strong>{ props.count }</strong> { props.name }
      </span>
    );
  }
}

CountStatus.propTypes = propTypes;
CountStatus.defaultProps = defaultProps;
