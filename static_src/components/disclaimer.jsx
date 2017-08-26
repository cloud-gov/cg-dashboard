
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
    let dotGovIconImg;
    let httpsIconImg;
    const dotGovIcon = require('cloudgov-style/img/icon-dot-gov.svg');
    const dotGovAlt = 'Dot gov';
    dotGovIconImg = <img className={ this.styler('usa-banner-icon','usa-media_block-img') } src={ dotGovAlt } src={ dotGovIcon }</img>;
    const httpsIcon = require('cloudgov-style/img/icon-https.svg');
    const httpsAlt = 'Https';
    httpsIconImg = <img className={ this.styler('usa-banner-icon','usa-media_block-img') } src={ httpsAlt } src={ httpsIcon }</img>;
    if (config.header.show_flag) {
      const flag = require('cloudgov-style/img/us_flag_small.png');
      const flagAlt = 'US flag signifying that this is a United States Federal Government website';
      flagImg = <img alt={ flagAlt } src={ flag }></img>;
    }
    return (
      <div className={ this.styler('usa-banner') }>
          <div className={ this.styler('usa-accordion') }>
              <header className={ this.styler('usa-banner-header') }>
                  <div className={ this.styler('usa-grid usa-banner-inner') }>
                      { flagImg }
                      <p>{ config.header.disclaimer }</p>
                      <button className={ this.styler('usa-accordion-button', 'usa-banner-button') } aria-expanded='false' aria-controls='gov-banner'>
              <span className={ this.styler('usa-banner-button-text') }>{ config.header.disclaimer_link_text }</span>
            </button>
                  </div>
              </header>
              <div className={ this.styler('usa-banner-content','usa-grid','usa-accordion-content') } id='gov-banner'>
                  <div className={ this.styler('usa-banner-guidance-gov usa-width-one-half') }>
                      { dotGovImg }
                      <div className={ this.styler('usa-media_block-body') }>
                          <p>
                              <strong>{ config.header.disclaimer_reason_gov_header }</strong>
                              <br>{ config.header.disclaimer_reason_gov_body }
                          </p>
                      </div>
                  </div>
                  <div className={ this.styler('usa-banner-guidance-ssl','usa-width-one-half') }>
                      { httpsImg }
                      <div className={ this.styler('usa-media_block-body') }>
                          <p>
                              <strong>{ config.header.disclaimer_reason_https_header }</strong>
                              <br>{ config.header.disclaimer_reason_https_body }
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}
