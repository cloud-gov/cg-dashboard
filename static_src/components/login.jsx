
import React from 'react';

export default class Login extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
    <div>
      <h1>Welcome to the cloud.gov dashboard</h1>
      <a href="/handshake" className="test-login">
        Login</a>
    </div>
    );
  }
}
