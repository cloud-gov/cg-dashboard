
import React from 'react';

import cgBaseStyles from 'cloudgov-style/css/base.css';
import mainContentStyles from 'cloudgov-style/css/components/main-content.css';
import sidenavStyles from 'cloudgov-style/css/components/sidenav.css';
import titleBarStyles from 'cloudgov-style/css/components/title_bar.css';
import navToggleStyles from 'cloudgov-style/css/components/nav_toggle.css';
import overrideStyles from './css/overrides.css';

import createStyler from './util/create_styler';

import Disclaimer from './components/disclaimer.jsx';
import Header from './components/header.jsx';
import Login from './components/login.jsx';
import LoginStore from './stores/login_store.js';
import { Nav } from './components/navbar.jsx';

function getState() {
  return { isLoggedIn: LoginStore.isLoggedIn() };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(
      cgBaseStyles,
      mainContentStyles,
      sidenavStyles,
      titleBarStyles,
      navToggleStyles,
      overrideStyles
    );
    this.state = { isLoggedIn: false };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(getState());
  }

  render() {
    let content;
    let sidebar;

    if (this.state.isLoggedIn) {
      content = this.props.children;
      sidebar = <Nav initialCurrentOrgGuid={ this.props.currentOrgGuid } />;
    } else {
      content = <Login />;
    }


    return (
      <div>
        <Disclaimer />
        <Header />
        <div className={ this.styler('sidenav-parent', 'main_content') }>
          <nav className={ this.styler('sidenav') }>
            { sidebar }
          </nav>
          <main className={ this.styler('sidenav-main', 'usa-content') }>
            <div className={ this.styler('content') }>
              { content }
            </div>
          </main>
        </div>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.any,
  currentOrgGuid: React.PropTypes.string
};

App.defaultProps = { children: [], currentOrgGuid: '0' };
