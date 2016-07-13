
import classNames from 'classnames';
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  getImagePath(iconName) {
    var img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `assets/${img}#i-${iconName}`;
  }

  render() {
    var iconClasses = classNames(style.icon,
        style[`icon-${ this.props.styleType }`]);

    return (
      <div className={ style['icon-container'] }>
        <svg className={ iconClasses }>
          <use
            xlinkHref={ this.getImagePath(this.props.name) }>
          </use>
        </svg>
      </div>
    );
  }
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
  styleType: React.PropTypes.string
}
Icon.defaultProps = {
  styleType: 'alt'
}
