import classnames from 'classnames';
import React from 'react';
import { config } from 'skin';

const dotGovIcon = ''; // require('cloudgov-style/img/icon-dot-gov.svg');
const httpsIcon = ''; //require('cloudgov-style/img/icon-https.svg');
const flag = require('cloudgov-style/img/us_flag_small.png');

const dotGovAlt = 'Dot gov';
const httpsAlt = 'Https';
const flagAlt = 'US flag signifying that this is a United States Federal Government website';

const CONTROLS = 'gov-banner';

export default class Disclaimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const { expanded } = this.state;
    const hidden = !expanded;
    const panelClass = classnames('usa-grid', {
      hide: hidden
    });

    let flagImg;

    if (config.header.show_flag) {
      flagImg = <img alt={ flagAlt } src={ flag } />;
    }

    return (
      <div className="usa-banner usa-disclaimer disclaimer-no_sidebar">
        <header className="grid">
            <span className='usa-disclaimer-official'>
              { config.header.disclaimer }
              { flagImg }
              <a
                className="action action-link action-secondary"
                aria-expanded={ expanded }
                aria-controls={ CONTROLS }
                onClick={ this.handleClick }
              >
                <span className="p1">{ config.header.disclaimer_link_text }</span>
                <span className="icon-chevron icon-chevron-down"></span>
              </a>
            </span>

        </header>
        <div className={ panelClass } id={ CONTROLS } aria-hidden={ hidden }>
          <div className="usa-width-one-half">
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
    );
  }
}
