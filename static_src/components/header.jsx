
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import LoginStore from '../stores/login_store.js';

import createStyler from '../util/create_styler';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `/assets/${img}#${iconName}`;
  }

  render() {
    const loggedIn = LoginStore.isLoggedIn();
    let loginLink = (!loggedIn) ? <a href="/handshake">Login</a> : <a href="/v2/logout">Logout</a>;
    return (
    <header className={ this.styler('header') }>
      <div className={ this.styler('header-wrap') }>
        <div className={ this.styler('header-title') }>
          <a href="/" className={ this.styler('logo') } title="Home">
            <svg className={ this.styler('logo') }>
              <use
                xlinkHref={ this.getImagePath('logo') }>
              </use>
            </svg>
          </a>
          <h1 className={ this.styler('usa-sr-only') }>cloud.gov</h1>
        </div>
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
            <li className={ this.styler('nav-link') }>
              { loginLink }
            </li>
          </ul>
        </nav>
      </div>
    </header>
    );
  }
}
