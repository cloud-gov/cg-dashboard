
import PropTypes from 'prop-types';
import React from 'react';

const ICON_TYPES = [
  'fill',
  'stroke'
];

const ICON_SIZE = [
  'small',
  'medium',
  'large'
];

const STYLE_TYPES = [
  'alt',
  'ok',
  'inactive',
  'error',
  'default'
];

const propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  styleType: PropTypes.oneOf(STYLE_TYPES),
  iconType: PropTypes.oneOf(ICON_TYPES),
  iconSize: PropTypes.oneOf(ICON_SIZE),
  bordered: PropTypes.bool
};

const defaultProps = {
  styleType: 'default',
  iconType: 'stroke',
  bordered: false
};

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    const fill = this.props.iconType === 'fill' ? 'fill-' : '';
    return `assets/${img}#i-${fill}${iconName}`;
  }

  render() {
    const mainClass = this.props.iconType === 'fill' ? 'icon-fill' : 'icon';
    const styleClass = `icon-${this.props.styleType}`;
    const sizeClass = this.props.iconSize && `icon-${this.props.iconSize}`;
    const borderedClass = (this.props.bordered) &&
      'icon-bordered';
    const iconClasses = `${mainClass} ${styleClass} ${sizeClass} ${borderedClass}`;

    return (
      <span>
        <svg className={ iconClasses }>
          <use xlinkHref={ this.getImagePath(this.props.name) }>
          </use>
        </svg> { this.props.children }
      </span>
    );
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;
