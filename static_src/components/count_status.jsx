
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import { entityHealth } from '../constants.js';
import EntityIcon from './entity_icon.jsx';

const ICON_TYPES = [
  'space',
  'app',
  'service'
];

const propTypes = {
  count: PropTypes.number,
  name: PropTypes.string.isRequired,
  health: PropTypes.oneOf(Object.values(entityHealth)),
  iconType: PropTypes.oneOf(ICON_TYPES)
};

const defaultProps = {
  count: 0,
  health: entityHealth.inactive,
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
    const statusClass = `count_status-${props.health.toLowerCase()}`;

    return (
      <div className={ this.styler('count_status', statusClass) }>
        <div className={ this.styler('count_status-icon') }>
          <EntityIcon entity={ props.iconType } health={ props.health } iconSize="medium" />
        </div>
        <div className={ this.styler('count_status-text') }>
          <strong>{ props.count }</strong> { props.name }
        </div>
      </div>
    );
  }
}

CountStatus.propTypes = propTypes;
CountStatus.defaultProps = defaultProps;
