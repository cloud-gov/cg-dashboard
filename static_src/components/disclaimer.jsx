
import classNames from 'classnames';
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class Disclaimer extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    const flag = require('cloudgov-style/img/us_flag_small.png');
    const flagAlt = 'US flag signifying that this is a United States Federal Government website';
    return (
      <div className={ this.styler('usa-disclaimer') }>
        <div className={ this.styler('grid') }>
          <span className={ this.styler('usa-disclaimer-official') }>
            An official website of the United States Government
            <img alt={ flagAlt } src={ flag }>
            </img>
          </span>
          <span className={ this.styler('usa-disclaimer-stage') }>
            This site is currently in alpha.&nbsp; 
            <a href="https://18f.gsa.gov/dashboard/stages/#alpha">
              What’s alpha?
            </a>
          </span>
        </div>
      </div>
    );
  }
}
