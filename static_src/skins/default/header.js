import React from 'react';
import PropTypes from 'prop-types';

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
  text: 'An open source web solution to manage your Cloud Foundry applications',
  renderToggleIcon,
  guidance1: {
    heading: 'Open source always and forever.',
    content: (
      <span>
        If you have any feedback or would like to contribute, please use the
        "Contact" link in the menu below.
      </span>
    )
  },
  guidance2: {}
};

const buildLogoSrc = () => `/assets/${logoSrc}#logo-dashboard`;

const logo = {
  render: () => (
    <div className="header-title">
      <a href="/#/" className="logo" title="Home 2">
        <img className="logo-img" src="https://www.cloudfoundry.org/wp-content/uploads/2017/01/CF-logo.png"/>
      </a>
      <h1 className="usa-sr-only">Dashboard</h1>
    </div>
  )
};

const links = [
  {
    text: 'Documentation',
    url: 'https://docs.cloudfoundry.org/devguide/index.html'
  },
  {
    text: 'Contact',
    url: 'https://github.com/18F/cg-dashboard/issues'
  }
];

const header = {
  disclaimer,
  logo,
  links
};

export default header;
