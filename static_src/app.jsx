
import classNames from 'classnames';
import React from 'react';

import cgBaseStyles from 'cloudgov-style/css/base.css';
import sidenavStyles from 'cloudgov-style/css/components/sidenav.css';
import titleBarStyles from 'cloudgov-style/css/components/title_bar.css';

import Login from './components/login.jsx';
import LoginStore from './stores/login_store.js';
import { Nav } from './components/navbar.jsx';

function getState() {
  return { isLoggedIn: LoginStore.isLoggedIn() };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
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
      { /* TODO use a separate navbar component for this. */ }
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#/dashboard">
            <i className="glyphicon glyphicon-cloud"></i>
            Deck
            <span className="label label-info">Alpha</span>
          </a>
        </div>
      </nav>
      <div className={ titleBarStyles['title_bar'] }>
        <div class="nav_toggle">
          <i class="fa fa-bars nav_toggle-icon"></i>
          <div class="icon-reorder tooltips" data-original-title="Toggle Navigation" data-placement="bottom">
          </div>
        </div>
        <h1 className={ titleBarStyles['title_bar-title'] }>Organizations</h1>
      </div>
      <div className={ sidenavStyles['sidenav-parent'] }>
        <nav className={ sidenavStyles.sidenav }>
          { sidebar }
        </nav>
        <main className={ classNames(sidenavStyles['sidenav-main'], cgBaseStyles['usa-content'])}>
          { content }
        </main>
      </div>
    </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.element,
  currentOrgGuid: React.PropTypes.string
};

App.defaultProps = { children: [], currentOrgGuid: '0' };
