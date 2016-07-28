
import 'cloudgov-style/css/base.css';
import './css/main.css';
// Icon used in cg-uaa.
import './img/dashboard-uaa-icon.jpg';

import { Router } from 'director';
import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './components/app_container.jsx';
import appActions from './actions/app_actions.js';
import cfApi from './util/cf_api.js';
import Home from './components/home.jsx';
import Login from './components/login.jsx';
import MainContainer from './components/main_container.jsx';
import Marketplace from './components/marketplace.jsx';
import orgActions from './actions/org_actions.js';
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

function space(orgGuid, spaceGuid, potentialPage) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  // TODO what happens if the space arrives before the changelistener is added?
  cfApi.fetchOrg(orgGuid);
  spaceActions.fetch(spaceGuid);
  // TODO use constant
  if (potentialPage === 'services') {
    serviceActions.fetchAllInstances(spaceGuid);
  }
  if (potentialPage === 'users') {
    userActions.fetchOrgUsers(orgGuid);
    userActions.fetchOrgUserRoles(orgGuid);
    userActions.fetchSpaceUsers(spaceGuid);
  }
  ReactDOM.render(
    <MainContainer initialSpaceGuid={spaceGuid}>
      <SpaceContainer
        initialSpaceGuid={ spaceGuid}
        initialOrgGuid={ orgGuid }
        currentPage={ potentialPage }
      />
    </MainContainer>, mainEl);
}

function app(orgGuid, spaceGuid, appGuid) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  spaceActions.fetch(spaceGuid);
  appActions.fetch(appGuid);
  appActions.fetchStats(appGuid);
  ReactDOM.render(
    <MainContainer initialSpaceGuid={ spaceGuid }>
      <AppContainer
        initialAppGuid={ appGuid }
      />
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
      <Marketplace initialOrgGuid={ orgGuid } />
    </MainContainer>,
  mainEl);
}

function checkAuth() {
  cfApi.getAuthStatus().then(() => {
    uaaApi.fetchUserInfo();
  });
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
