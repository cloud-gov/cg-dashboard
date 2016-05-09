
import classNames from 'classnames';
import React from 'react';

import styles from 'cloudgov-style/css/components/icon.css';

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
    var iconClasses = classNames(styles.icon,
        styles[`icon-${ this.props.styleType }`]);

    return (
      <div className={ styles['icon-container'] }>
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
