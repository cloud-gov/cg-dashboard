
import React from 'react';

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
    this.state = { isLoggedIn: false };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this._onChange);
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
        <div>
          <nav>
            { sidebar }
          </nav>
          <main>
            { content }
          </main>
        </div>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.array,
  currentOrgGuid: React.PropTypes.string
};
App.defaultProps = { children: [], currentOrgGuid: '0' };
