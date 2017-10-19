import React from 'react';
import PropTypes from 'prop-types';

import flagSrc from 'cloudgov-style/img/us_flag_small.png';
import arrowUpSrc from './angle-arrow-up-primary-hover.svg';
import arrowDownSrc from './angle-arrow-down-primary.svg';
import dotGovIconSrc from './icon-dot-gov.svg';
import httpsIconSrc from './icon-https.svg';
import logoSrc from 'cloudgov-style/img/cloudgov-sprite.svg';

const renderToggleIcon = ({ expanded }) => (
  <img
    className="right-arrow"
    src={expanded ? arrowUpSrc : arrowDownSrc}
    alt={expanded ? 'Up arrow' : 'Down arrow'}
  />
);

renderToggleIcon.propTypes = { expanded: PropTypes.bool.isRequired };
renderToggleIcon.defaultProps = { expanded: false };

const disclaimer = {
  flag: {
    src: flagSrc,
    alt:
      'US flag signifying that this is a United States Federal Government website'
  },
  text: 'An official website of the United States government',
  linkText: 'Here’s how you know',
  renderToggleIcon,
  guidance1: {
    heading: 'The .gov means it’s official.',
    content: (
      <span>
        Federal government websites often end in .gov or .mil. Before sharing
        sensitive information, make sure you’re on a federal government site.
      </span>
    ),
    renderIcon: () => (
      <img
        className="usa-banner-icon usa-media_block-img"
        alt="Dot gov"
        src={dotGovIconSrc}
      />
    )
  },
  guidance2: {
    heading: 'The site is secure.',
    content: (
      <span>
        The https:// ensures that you are connecting to the official website and
        that any information you provide is encrypted and transmitted securely.
      </span>
    ),
    renderIcon: () => (
      <img
        className="usa-banner-icon usa-media_block-img"
        alt="HTTPS"
        src={httpsIconSrc}
      />
    )
  }
};

const buildLogoSrc = () => `/assets/${logoSrc}#logo-dashboard`;

const logo = {
  render: () => (
    <div className="header-title">
      <a href="/#/" className="logo" title="Home">
        <svg className="logo-img">
          <use xlinkHref={buildLogoSrc()} />
        </svg>
      </a>
      <h1 className="usa-sr-only">cloud.gov</h1>
    </div>
  )
};

const links = [
  {
    text: 'Documentation',
    url: 'https://cloud.gov/docs/'
  },
  {
    text: 'Updates',
    url: 'https://cloud.gov/updates/'
  },
  {
    text: 'Status',
    url: 'https://cloudgov.statuspage.io/'
  },
  {
    text: 'Contact',
    url: 'https://cloud.gov/docs/help/'
  }
];

const header = {
  disclaimer,
  logo,
  links
};

export default header;
