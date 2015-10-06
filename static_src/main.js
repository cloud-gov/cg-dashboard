
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import {Router} from 'director';
import React from 'react';

import App from './app.jsx';
import Login from './components/login.jsx';

const mainEl = document.querySelector('.js-app');


function login() {
  React.render(<App><Login/></App>, mainEl);
}

function dashboard() {
  React.render(<App></App>, mainEl);
}

function checkAuth() {
  login();
  return false;
}

let routes = {
  '/': dashboard,
  '/login': login
}


let router = new Router(routes);
router.configure({
  before: checkAuth
});
router.init();

