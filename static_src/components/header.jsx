import React from 'react';

import LoginStore from '../stores/login_store.js';
import HeaderLink from './header_link.jsx';

import Action from './action.jsx';
import { config } from 'skin';

export default class Header extends React.Component {
  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `/assets/${img}#${iconName}`;
  }

  render() {
    const loggedIn = LoginStore.isLoggedIn();
    let loginLink = (!loggedIn) ?
    <HeaderLink>
      <Action href="/handshake" label="Login" type="outline">
        Login
      </Action>
    </HeaderLink> :
    <HeaderLink>
      <Action href="/logout" label="Log out" type="outline">
        Log out
      </Action>
    </HeaderLink>;
    return (
    <header className="header header-no_sidebar test-header">
      <div className="header-wrap">
        <div className="header-title">
          <a href="/#/" className="logo" title="Home">
            <svg className="logo-img">
              <use
                xlinkHref={ this.getImagePath('logo-dashboard') }
              >
              </use>
            </svg>
          </a>
          <h1 className="usa-sr-only">cloud.gov</h1>
        </div>
        <nav className="header-side">
          <ul className="nav">
            { config.header.links.map((link, index) =>
                <HeaderLink url={link.url} text={link.text} key={index} />)
            }
            { loginLink }
          </ul>
        </nav>
      </div>
    </header>
    );
  }
}
