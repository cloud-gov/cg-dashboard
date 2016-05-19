
import React from 'react';

import createStyler from '../util/create_styler';

import headerStyle from 'cloudgov-style/css/components/header.css';
import navStyle from 'cloudgov-style/css/components/nav.css';
import logoStyle from 'cloudgov-style/css/components/logo.css';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(headerStyle, navStyle, logoStyle);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `/assets/${img}#${iconName}`;
  }

  render() {
    return (
    <header className={ this.styler('header') }>
      <div className={ this.styler('header-wrap') }>
        <h2 className={ this.styler('header-title') }>
          <a href="/" className={ this.styler('logo') } title="Home">
            <svg className={ this.styler('logo') }>
              <use
                xlinkHref={ this.getImagePath('logo') }>
              </use>
            </svg>
          </a>
        </h2>
        <nav className={ this.styler('header-side') }>
          <ul className={ this.styler('nav') }>
            <li className={ this.styler('nav-link') }>
              <a href="https://cloud.gov/#about">About</a>
            </li>
            <li className={ this.styler('nav-link') }>
              <a href="https://docs.cloud.gov">Documentation</a>
            </li>
            <li className={ this.styler('nav-link') }>
              <a href="https://cloud.gov/updates/">Updates</a>
            </li>
            <li className={ this.styler('nav-link') }>
              <a href="https://cloudgov.statuspage.io/">
                Status
              </a>
            </li>
            <li className={ this.styler('nav-link') }>
              <a href="https://cloud.gov/#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    );
  }
}
