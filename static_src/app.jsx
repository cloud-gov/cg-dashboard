
import classNames from 'classnames';
import React from 'react';

import styles from './css/main.css';

import loginActions from './actions/login_actions.js';
import Login from './components/login.jsx';
import LoginStore from './stores/login_store.js';
import { Nav } from './components/navbar.jsx';

function getState() {
  return {isLoggedIn: LoginStore.isLoggedIn()};
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    this.setState(getState());
    LoginStore.addChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(getState());
  }

  render() {
    var content,
        sidebar;

    if (this.state.isLoggedIn) {
      content = this.props.children;
      sidebar = <Nav initialCurrentOrgGuid={ this.props.currentOrgGuid } />;
    } else {
      content = <Login />;
    }

    let sidebarClasses = classNames('col-sm-3', 'col-md-2', styles.sidebar);
    let mainClasses = classNames('col-sm-9', 'col-sm-offset-3', 'col-md-10',
                                 'col-md-offset-2', styles.main);
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
          <nav className={ sidebarClasses }>
            { sidebar }
          </nav>
          <main className={ mainClasses }>
            { content }
          </main>
        </div>
      </div>
    </div>
    );
  }
};
App.propTypes = { currentOrgGuid: React.PropTypes.string };
App.defaultProps = { currentOrgGuid: '0' };
