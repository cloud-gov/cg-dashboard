
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import LoginStore from '../stores/login_store.js';
import HeaderLink from './header_link.jsx';

import createStyler from '../util/create_styler';
import { config } from 'skin';

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
    let loginLink = (!loggedIn) ? <HeaderLink url="/handshake" text="Login" /> : <HeaderLink url="/v2/logout" text="Logout" />;
    return (
    <header className={ this.styler('header') }>
      <div className={ this.styler('header-wrap') }>
        <div className={ this.styler('header-title') }>
          <a href="/" className={ this.styler('logo') } title="Home">
            <svg className={ this.styler('logo-img') }>
              <use
                xlinkHref={ this.getImagePath('logo') }>
              </use>
            </svg>
          </a>
          <h1 className={ this.styler('usa-sr-only') }>cloud.gov</h1>
        </div>
        <nav className={ this.styler('header-side') }>
          <ul className={ this.styler('nav') }>
            { config.header.links.map((link, index) => <HeaderLink url={link.url} text={link.text} key={index} />) }
            { loginLink }
          </ul>
        </nav>
      </div>
    </header>
    );
  }
}
