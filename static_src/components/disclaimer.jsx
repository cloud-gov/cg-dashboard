
import classNames from 'classnames';
import React from 'react';
import { config } from 'skin';

const dotGovIcon = ''; // require('cloudgov-style/img/icon-dot-gov.svg');
const httpsIcon = ''; //require('cloudgov-style/img/icon-https.svg');
const flag = require('cloudgov-style/img/us_flag_small.png');

const dotGovAlt = 'Dot gov';
const httpsAlt = 'Https';
const flagAlt = 'US flag signifying that this is a United States Federal Government website';

export default class Disclaimer extends React.Component {
  render() {
    let flagImg;

    if (config.header.show_flag) {
      flagImg = <img alt={ flagAlt } src={ flag } />;
    }

    return (
      <div className="usa-banner">
        <div className="usa-accordion">
          <header className="usa-banner-header">
            <div className="usa-grid usa-banner-inner">
                { flagImg }
                <p>{ config.header.disclaimer }</p>
                <button className="usa-accordion-button usa-banner-button" aria-expanded='false' aria-controls='gov-banner'>
                  <span className="usa-banner-button-text">{ config.header.disclaimer_link_text }</span>
                </button>
            </div>
          </header>
          <div className="usa-banner-content usa-grid usa-accordion-content" id='gov-banner'>
            <div className="usa-banner-guidance-gov usa-width-one-half">
              <img className="usa-banner-icon usa-media_block-img" alt={ dotGovAlt } src={ dotGovIcon } />;
              <div className="usa-media_block-body">
                <p>
                  <strong>{ config.header.disclaimer_reason_gov_header }</strong>
                  <br />
                  { config.header.disclaimer_reason_gov_body }
                </p>
              </div>
            </div>
            <div className="usa-banner-guidance-ssl usa-width-one-half">
              <img className="usa-banner-icon usa-media_block-img" alt={ httpsAlt } src={ httpsIcon } />;
              <div className="usa-media_block-body">
                <p>
                  <strong>{ config.header.disclaimer_reason_https_header }</strong>
                  <br />
                  { config.header.disclaimer_reason_https_body }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
