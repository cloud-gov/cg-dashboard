
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import { FormError } from './form.jsx';
import LoginStore from '../stores/login_store.js';

import createStyler from '../util/create_styler';

const propTypes = {
  titleBar: React.PropTypes.element
};


const defaultProps = {
  titleBar: <div></div>
};

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    return `/assets/${img}#${iconName}`;
  }
  getInitialState(){
    return {"showHideSearch":"usa-search js-search-form"};
  }

  toggleSearch() {
      var css = (this.props.showHideSearch === "usa-search js-search-form") ? "usa-search js-search-form is-visible" : "usa-search js-search-form";
      this.setState({"showHideSearch":css});
  }

  render() {
    const loggedIn = LoginStore.isLoggedIn();
    let loginLink = (!loggedIn) ? <a href="/handshake">Login</a> : <a href="/v2/logout">Log out</a>;
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
          <div className={ this.styler('usa-nav-inner')}>
        <div className={ this.styler('usa-nav-secondary')}>
        <nav className={ this.styler('header-side') }>
          <form className={this.props.showHideSearch} accept-charset="UTF-8" action="https://search.usa.gov/search" id="search_form" method="get">
                    <div role="search">
                      <label className={ this.styler('usa-sr-only')} for="search-field-small">Search</label>
                      <input id="affiliate" name="affiliate" type="hidden" value="cloud.gov"></input>
                      <input name="utf8" type="hidden" value="✓"></input>
                      <input id="search-field" autocomplete="off" type="search" name="query" placeholder="Search documentation"></input>
                    <button type="submit" onClick={this.toggleSearch.bind(this)}>
                        <span className={ this.styler('usa-sr-only')}>Search</span>
                      </button>
                    </div>
                  </form>
          <ul className={ this.styler('nav') }>
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
              <Action type="outline" style="cautious">
                { loginLink }
              </Action>
            </li>
            <li className={ this.styler('js-search-button-container') }>
              <a className={ this.styler('js-search-button') }><span>Search</span></a>
            </li>
          </ul>

        </nav>
        </div>
      </div>
    </div>
        { this.props.titleBar }
    </header>
    );
  }
}




Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
