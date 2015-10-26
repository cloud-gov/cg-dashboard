
import React from 'react';

export default class Login extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
    <div className="jumbotron text-center">
      <h1>Welcome to Cf-Deck</h1>
      <a href="/handshake" className="btn btn-primary btn-md test-login">
        Login</a>
      <div className="text-right">
        <h3>Version: <span className="label label-info">Alpha</span></h3>
        <a href="https://github.com/18F/cf-deck" className="test-contribute_link">
          <span className="glyphicon glyphicon-link" aria-hidden="true">
            Contribute</span>
        </a>
      </div>
    </div>
    );
  }
}
