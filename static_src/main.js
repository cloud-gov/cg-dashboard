
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import {Router} from 'director';
import React from 'react';

import App from './app.jsx';
import cfApi from './util/cf_api.js';
import Login from './components/login.jsx';
import orgActions from './actions/org_actions.js';

const mainEl = document.querySelector('.js-app');


function login() {
  React.render(<App><Login/></App>, mainEl);
}

function dashboard() {
  React.render(<App>
    <h3>Welcome to CF-Deck</h3>
    <h5>Pick an organization to get started</h5>
  </App>, mainEl);
}

function org(orgGuid) {
  orgActions.changeCurrentOrg(orgGuid);
  React.render(<App></App>, mainEl);
}

function checkAuth() {
  cfApi.getAuthStatus();
}

function notFound() {
  React.render(<h1>Not Found</h1>, mainEl);
}

let routes = {
  '': dashboard,
  '/': dashboard,
  '/dashboard': dashboard,
  '/login': login,
  '/org': {
    '/:orgGuid': {
      on: org
    }
  }
}

let router = new Router(routes);
router.configure({
  before: checkAuth,
  notfound: notFound
});
router.init();

