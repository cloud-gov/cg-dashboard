
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import React from 'react';

import App from './app.jsx';

class Login extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
    <App>
      <div className="container">
        <h1>Login</h1>
      </div>
    </App>
    );
  }

}

React.render(<Login/>, document.querySelector('.js-app'));

