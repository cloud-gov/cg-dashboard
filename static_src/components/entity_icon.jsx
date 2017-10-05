
import PropTypes from 'prop-types';
import React from 'react';

import Icon from './icon.jsx';
import { entityHealth } from '../constants.js';

const ENTITIES = ['app', 'service', 'space', 'org'];

const propTypes = {
  children: PropTypes.node,
  entity: PropTypes.oneOf(ENTITIES).isRequired,
  iconSize: PropTypes.string,
  health: PropTypes.oneOf(Object.values(entityHealth))
};

const defaultProps = {
  health: entityHealth.default
};

export default class EntityIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const statusClass = this.props.health;

    return (
      <Icon
        name={ this.props.entity }
        styleType={ statusClass }
        iconSize={ this.props.iconSize }
        iconType="fill"
        bordered={ ['app', 'space', 'service'].includes(this.props.entity) }
      >
        { this.props.children }
      </Icon>
    );
  }
}

EntityIcon.propTypes = propTypes;
EntityIcon.defaultProps = defaultProps;
