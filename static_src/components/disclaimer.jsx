
import classNames from 'classnames';
import React from 'react';

import baseStyle from 'cloudgov-style/css/base.css';

function createStyler(...args) {
  function uniqueOnly(value, index, self) {
    return self.indexOf(value) === index;
  }

  return (className) => {
    const classes = args.map((f) => {
      if (f[className]) return f[className];
      return className;
    }).filter(uniqueOnly);
    return classNames.apply([], classes);
  };
}

export default class Disclaimer extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(baseStyle);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `/assets/${img}#${iconName}`;
  }

  render() {
    const flag = require('cloudgov-style/img/us_flag_small.png');
    return (
      <div className={ this.styler('usa-disclaimer') }>
        <div className={ this.styler('usa-grid') }>
          <span className={ this.styler('usa-disclaimer-official') }>
            An official website of the United States Government
            <img alt="US flag signifying that this is a United States Federal Government website" src={ flag }>
            </img>
          </span>
          <span className={ this.styler('usa-disclaimer-stage') }>
            This site is currently in alpha.
            <a href="https://18f.gsa.gov/dashboard/stages/#alpha">
              Learn more.
            </a>
          </span>
        </div>
      </div>
    );
  }
}
