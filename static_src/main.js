
import 'cloudgov-style/css/base.css';
import './css/main.css';

import { Router } from 'director';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.jsx';
import AppPage from './components/app_page.jsx';
import appActions from './actions/app_actions.js';
import cfApi from './util/cf_api.js';
import Login from './components/login.jsx';
import Marketplace from './components/marketplace.jsx';
import orgActions from './actions/org_actions.js';
import routeActions from './actions/route_actions.js';
import serviceActions from './actions/service_actions.js';
import Space from './components/space.jsx';
import SpaceList from './components/space_list.jsx';
import { trackPageView } from './util/analytics.js';

const mainEl = document.querySelector('.js-app');


function login() {
  ReactDOM.render(<App><Login /></App>, mainEl);
}

function dashboard() {
  ReactDOM.render(<App>
    <h3>Welcome to CF-Deck</h3>
    <h5>Pick an organization to get started</h5>
  </App>, mainEl);
}

function org(orgGuid) {
  orgActions.changeCurrentOrg(orgGuid);
  cfApi.fetchOrg(orgGuid);
  ReactDOM.render(
    <App>
      <SpaceList initialOrgGuid={ orgGuid } />
    </App>, mainEl);
}

function space(orgGuid, spaceGuid, potentialPage) {
  orgActions.changeCurrentOrg(orgGuid);
  // TODO what happens if the space arrives before the changelistener is added?
  cfApi.fetchOrg(orgGuid);
  cfApi.fetchSpace(spaceGuid);
  // TODO use constant
  if (potentialPage === 'users') {
    cfApi.fetchOrgUserRoles(orgGuid);
  }
  ReactDOM.render(
    <App>
      <Space
        initialSpaceGuid={ spaceGuid}
        initialOrgGuid={ orgGuid }
        currentPage={ potentialPage }
      />
    </App>, mainEl);
}

function app(orgGuid, spaceGuid, appGuid) {
  appActions.fetch(appGuid);
  appActions.fetchStats(appGuid);
  routeActions.fetchRoutesForApp(appGuid);
  ReactDOM.render(
    <App>
      <AppPage
        initialAppGuid={ appGuid }
      />
    </App>, mainEl);
}

function marketplace(orgGuid, serviceGuid, servicePlanGuid) {
  cfApi.fetchOrg(orgGuid);
  cfApi.fetchAllServices(orgGuid);
  if (serviceGuid && servicePlanGuid) {
    serviceActions.createInstanceForm(serviceGuid, servicePlanGuid);
  }
  ReactDOM.render(
    <App>
      <Marketplace initialOrgGuid={ orgGuid } />
    </App>,
  mainEl);
}

function checkAuth() {
  cfApi.getAuthStatus();
  orgActions.fetchAll();
}

function notFound() {
  ReactDOM.render(<h1>Not Found</h1>, mainEl);
}

const routes = {
  '/': dashboard,
  '/dashboard': dashboard,
  '/login': login,
  '/org': {
    '/:orgGuid': {
      '/spaces': {
        '/:spaceGuid': {
          '/:page': {
            on: space
          },
          '/apps': {
            '/:appGuid': {
              on: app
            }
          },
          on: space
        }
      },
      '/marketplace': {
        '/create/:serviceGuid/:servicePlanGuid': {
          on: marketplace
        },
        on: marketplace
      },
      on: org
    }
  }
};

const router = new Router(routes);
router.configure({
  before: checkAuth,
  notfound: notFound,
  on: () => trackPageView(window.location.hash)
});
router.init('/');
