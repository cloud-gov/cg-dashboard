
import 'cloudgov-style/css/base.css';
import './css/main.css';
// Icon used in cg-uaa.
import './img/dashboard-uaa-icon.jpg';
import 'cloudgov-style/img/favicon.ico';

import { Router } from 'director';
import React from 'react';
import ReactDOM from 'react-dom';

import activityActions from './actions/activity_actions.js';
import AppContainer from './components/app_container.jsx';
import appActions from './actions/app_actions.js';
import cfApi from './util/cf_api.js';
import Home from './components/home.jsx';
import Login from './components/login.jsx';
import MainContainer from './components/main_container.jsx';
import Marketplace from './components/marketplace.jsx';
import orgActions from './actions/org_actions.js';
import quotaActions from './actions/quota_actions.js';
import routeActions from './actions/route_actions.js';
import spaceActions from './actions/space_actions.js';
import serviceActions from './actions/service_actions.js';
import SpaceContainer from './components/space_container.jsx';
import SpaceList from './components/space_list.jsx';
import { trackPageView } from './util/analytics.js';
import uaaApi from './util/uaa_api.js';
import userActions from './actions/user_actions.js';

const mainEl = document.querySelector('.js-app');

function login() {
  ReactDOM.render(<MainContainer><Login /></MainContainer>, mainEl);
}

function dashboard() {
  ReactDOM.render(<MainContainer>
    <Home />
  </MainContainer>, mainEl);
}

function org(orgGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  orgActions.fetch(orgGuid);
  ReactDOM.render(
    <MainContainer>
      <SpaceList />
    </MainContainer>, mainEl);
}

function space(orgGuid, spaceGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  cfApi.fetchOrg(orgGuid);
  spaceActions.fetch(spaceGuid);
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
  serviceActions.fetchAllInstances(spaceGuid);
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

function marketplace(orgGuid, serviceGuid, servicePlanGuid) {
  orgActions.fetch(orgGuid);
  serviceActions.fetchAllServices(orgGuid);
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace('0');
  if (serviceGuid && servicePlanGuid) {
    serviceActions.createInstanceForm(serviceGuid, servicePlanGuid);
  }
  ReactDOM.render(
    <MainContainer>
      <Marketplace />
    </MainContainer>,
  mainEl);
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
  '/': dashboard,
  '/dashboard': dashboard,
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
