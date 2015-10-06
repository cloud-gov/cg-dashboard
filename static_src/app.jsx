
import React from 'react';

import Login from './components/login.jsx';
import LoginStore from './stores/login_store.js';

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
    var content;

    if (this.state.isLoggedIn) {
      content = this.props.children;
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
        { content }
      </div>
    </div>
    );
  }
};

App.propTypes = { content: React.PropTypes.element };

