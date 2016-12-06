
import React from 'react';

import Icon from './icon.jsx';
import { appStates } from '../constants.js';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const ENTITIES = [ 'app', 'space', 'org'];

const STATE_MAP = {};
STATE_MAP[appStates.running] = 'ok';
STATE_MAP[appStates.started] = 'ok';
STATE_MAP[appStates.stopped] = 'inactive';
STATE_MAP[appStates.crashed] = 'error';

const propTypes = {
  entity: React.PropTypes.oneOf(ENTITIES).isRequired,
  state: React.PropTypes.oneOf(Object.values(appStates))
};

const defaultProps = {
  state: appStates.default
};

export default class EntityIcon extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
  }

  render() {
    const stateClass = STATE_MAP[this.props.state];

    return <Icon name={ this.props.entity } styleType={ stateClass }
      iconType="fill" />;
  }
}

EntityIcon.propTypes = propTypes;
EntityIcon.defaultProps = defaultProps;
