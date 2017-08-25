
import classNames from 'classnames';
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';
import { config } from 'skin';

export default class Disclaimer extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    let flagImg;
    if (config.header.show_flag) {
      const flag = require('cloudgov-style/img/us_flag_small.png');
      const flagAlt = 'US flag signifying that this is a United States Federal Government website';
      flagImg = <img alt={ flagAlt } src={ flag }></img>;
    }
    return (
      <div className={ this.styler('usa-disclaimer', 'disclaimer-no_sidebar') }>
        <div className={ this.styler('grid') }>
          <span className={ this.styler('usa-disclaimer-official') }>
            { config.header.disclaimer }
            { flagImg }
          </span>

        </div>
      </div>
    );
  }
}
