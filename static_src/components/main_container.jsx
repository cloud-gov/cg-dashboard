
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import overrideStyle from '../css/overrides.css';

import createStyler from '../util/create_styler';

import Disclaimer from './disclaimer.jsx';
import Header from './header.jsx';
import Login from './login.jsx';
import LoginStore from '../stores/login_store.js';
import { Nav } from './navbar.jsx';

function getState() {
  return { isLoggedIn: LoginStore.isLoggedIn() };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style, overrideStyle);
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
      sidebar = <Nav
        initialCurrentOrgGuid={ this.props.currentOrgGuid }
        initialSpaceGuid={ this.props.initialSpaceGuid }
      />;
    } else {
      content = <Login />;
    }


    return (
      <div>
        <Disclaimer />
        <Header />
        <div className={ this.styler('sidenav-parent', 'main_content', 'content-dashboard') }>
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
  currentOrgGuid: React.PropTypes.string,
  initialSpaceGuid: React.PropTypes.string
};

App.defaultProps = {
  children: [],
  currentOrgGuid: '0',
  initialSpaceGuid: '0'
};
