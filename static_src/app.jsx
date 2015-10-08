
import React from 'react';

import loginActions from './actions/login_actions.js';
import Login from './components/login.jsx';
import LoginStore from './stores/login_store.js';
import Navbar from './components/navbar.jsx';

function getState() {
  return {isLoggedIn: LoginStore.isLoggedIn()};
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};
  }

  componentDidMount() {
    this.setState(getState());
    LoginStore.addChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(getState());
  }

  render = () => {
    var content,
        sidebar;

    if (this.state.isLoggedIn) {
      content = this.props.children;
      sidebar = <Navbar />;
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
      <div className="container-fluid">
        <div className="row">
          <nav className="col-sm-3 col-md-2 sidebar">
            { sidebar }
          </nav>
          <main className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            { content }
          </main>
        </div>
      </div>
    </div>
    );
  }
};

App.propTypes = { content: React.PropTypes.element };

