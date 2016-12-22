import 'cloudgov-style/css/base.css';
import './css/main.css';
// Icon used in cg-uaa.
import './img/dashboard-uaa-icon.jpg';
import 'cloudgov-style/img/favicon.ico';
import axios from 'axios';

import { Router } from 'director';
import React from 'react';
import ReactDOM from 'react-dom';

import activityActions from './actions/activity_actions.js';
import AppContainer from './components/app_container.jsx';
import appActions from './actions/app_actions.js';
import cfApi from './util/cf_api.js';
import Login from './components/login.jsx';
import MainContainer from './components/main_container.jsx';
import orgActions from './actions/org_actions.js';
import Overview from './components/overview_container.jsx';
import OrgContainer from './components/org_container.jsx';
import quotaActions from './actions/quota_actions.js';
import routeActions from './actions/route_actions.js';
import spaceActions from './actions/space_actions.js';
import serviceActions from './actions/service_actions.js';
import SpaceContainer from './components/space_container.jsx';
import { trackPageView } from './util/analytics.js';
import uaaApi from './util/uaa_api.js';
import userActions from './actions/user_actions.js';

const mainEl = document.querySelector('.js-app');

const meta = document.querySelector('meta[name="gorilla.csrf.Token"]');
if (meta) {
  axios.defaults.headers.common['X-CSRF-Token'] = meta.content;
}

const MAX_OVERVIEW_SPACES = 10;

function login() {
  ReactDOM.render(<MainContainer><Login /></MainContainer>, mainEl);
}

function overview() {
  cfApi.fetchSpaces().then((spaces) => {
    let i = 0;
    const max = Math.min(MAX_OVERVIEW_SPACES, spaces.length);
    for (; i < max; i++) {
      spaceActions.fetch(spaces[i].guid);
    }
  });
  ReactDOM.render(<MainContainer>
    <Overview />
  </MainContainer>, mainEl);
}

function org(orgGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  orgActions.fetch(orgGuid);
  cfApi.fetchSpaces().then(() => spaceActions.fetchAllForOrg(orgGuid));
  ReactDOM.render(
    <MainContainer>
      <OrgContainer />
    </MainContainer>, mainEl);
}

function space(orgGuid, spaceGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  cfApi.fetchOrg(orgGuid);
  spaceActions.fetch(spaceGuid);
  serviceActions.fetchAllInstances(spaceGuid);
  userActions.changeCurrentlyViewedType('space_users');
  userActions.fetchSpaceUsers(spaceGuid);
  orgActions.fetch(orgGuid);
  serviceActions.fetchAllServices(orgGuid);
}

function renderSpaceContainer(page) {
  ReactDOM.render(
    <MainContainer>
      <SpaceContainer
        currentPage={ page }
      />
    </MainContainer>, mainEl);
}

function apps(orgGuid, spaceGuid) {
  space(orgGuid, spaceGuid);
  renderSpaceContainer('apps');
}

function services(orgGuid, spaceGuid) {
  space(orgGuid, spaceGuid);
  renderSpaceContainer('services');
}

function users(orgGuid, spaceGuid, potentialPage) {
  space(orgGuid, spaceGuid);
  if (potentialPage === 'org') {
    userActions.changeCurrentlyViewedType('org_users');
    userActions.fetchOrgUsers(orgGuid);
    userActions.fetchOrgUserRoles(orgGuid);
  } else {
    userActions.changeCurrentlyViewedType('space_users');
    userActions.fetchSpaceUsers(spaceGuid);
  }
  renderSpaceContainer('users');
}

function app(orgGuid, spaceGuid, appGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  spaceActions.fetch(spaceGuid);
  activityActions.fetchSpaceEvents(spaceGuid);
  activityActions.fetchAppLogs(appGuid);
  quotaActions.fetchAll();
  appActions.changeCurrentApp(appGuid);
  appActions.fetch(appGuid);
  appActions.fetchStats(appGuid);
  routeActions.fetchRoutesForSpace(spaceGuid);
  routeActions.fetchRoutesForApp(appGuid);
  serviceActions.fetchAllInstances(spaceGuid);
  serviceActions.fetchServiceBindings();
  ReactDOM.render(
    <MainContainer>
      <AppContainer />
    </MainContainer>, mainEl);
}

function checkAuth() {
  cfApi.getAuthStatus().then(() => {
    uaaApi.fetchUserInfo();
  });
  orgActions.fetchAll();
  spaceActions.fetchAll();
}

function notFound() {
  ReactDOM.render(<h1>Not Found</h1>, mainEl);
}

const routes = {
  '/': overview,
  '/dashboard': overview,
  '/login': login,
  '/org': {
    '/:orgGuid': {
      '/spaces': {
        '/:spaceGuid': {
          '/services': {
            on: services
          },
          '/users': {
            '/:page': {
              on: users
            },

            on: users
          },
          '/apps': {
            '/:appGuid': {
              on: app
            },
            on: apps
          },
          on: apps
        }
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
