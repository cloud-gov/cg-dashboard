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
import errorActions from './actions/error_actions';
import Loading from './components/loading.jsx';
import Login from './components/login.jsx';
import loginActions from './actions/login_actions';
import LoginStore from './stores/login_store';
import MainContainer from './components/main_container.jsx';
import orgActions from './actions/org_actions.js';
import Overview from './components/overview_container.jsx';
import OrgContainer from './components/org_container.jsx';
import pageActions from './actions/page_actions.js';
import quotaActions from './actions/quota_actions.js';
import routeActions from './actions/route_actions.js';
import spaceActions from './actions/space_actions.js';
import serviceActions from './actions/service_actions.js';
import SpaceContainer from './components/space_container.jsx';
import { trackPageView } from './util/analytics.js';
import userActions from './actions/user_actions.js';

const mainEl = document.querySelector('.js-app');

const meta = document.querySelector('meta[name="gorilla.csrf.Token"]');
if (meta) {
  axios.defaults.headers.common['X-CSRF-Token'] = meta.content;
}

const MAX_OVERVIEW_SPACES = 10;

function login(next) {
  ReactDOM.render(<MainContainer><Login /></MainContainer>, mainEl);
  next();
}

function overview(next) {
  pageActions.load();

  // Reset the state
  orgActions.changeCurrentOrg();
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();

  spaceActions.fetchAll()
    .then(spaces => {
      let i = 0;
      const max = Math.min(MAX_OVERVIEW_SPACES, spaces.length);
      const fetches = [];
      for (; i < max; i++) {
        fetches.push(spaceActions.fetch(spaces[i].guid));
      }

      return Promise.all(fetches);
    })
    .then(pageActions.loadSuccess, pageActions.loadError);

  ReactDOM.render(<MainContainer>
    <Overview />
  </MainContainer>, mainEl);

  next();
}

function org(orgGuid, next) {
  // Reset the state
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();

  orgActions.toggleSpaceMenu(orgGuid);
  orgActions.fetch(orgGuid);
  cfApi.fetchSpaces().then(() => spaceActions.fetchAllForOrg(orgGuid));
  userActions.changeCurrentlyViewedType('org_users');
  userActions.fetchOrgUsers(orgGuid);
  userActions.fetchOrgUserRoles(orgGuid);
  ReactDOM.render(
    <MainContainer>
      <OrgContainer />
    </MainContainer>, mainEl);

  next();
}

function space(orgGuid, spaceGuid, next) {
  // Reset the state
  appActions.changeCurrentApp();

  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  cfApi.fetchOrg(orgGuid);
  spaceActions.fetch(spaceGuid);
  serviceActions.fetchAllInstances(spaceGuid);
  userActions.changeCurrentlyViewedType('space_users');
  userActions.fetchSpaceUsers(spaceGuid);
  orgActions.fetch(orgGuid);
  serviceActions.fetchAllServices(orgGuid);

  next();
}

function renderSpaceContainer(page, next) {
  ReactDOM.render(
    <MainContainer>
      <SpaceContainer
        currentPage={ page }
      />
    </MainContainer>, mainEl);
  next();
}

function apps(orgGuid, spaceGuid, next) {
  space(orgGuid, spaceGuid);
  renderSpaceContainer('apps');
  next();
}

function app(orgGuid, spaceGuid, appGuid, next) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  spaceActions.fetch(spaceGuid);
  activityActions.fetchSpaceEvents(spaceGuid, appGuid);
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
  next();
}

function checkAuth(...args) {
  const next = args.pop();

  // These may or may not be set depending on route
  const [orgGuid, spaceGuid] = args;

  loginActions
    .fetchStatus()
    .then(authStatus => {
      // We're interested in the most recent fetchStatus, so avoid checking
      // LoginStore.isLoggedIn which won't be the latest in case of an error.
      if (authStatus && authStatus.status !== 'authorized') {
        // The user is Unauthenicated. We could redirect to a home page where
        // user could click login but since we don't have any such page, just
        // start the login flow by redirecting to /handshake. This is as if they
        // had clicked login.
        window.location = '/handshake';

        // Just in case something goes wrong, don't leave the user hanging. Show
        // a delayed loading indicator to give them a hint. Hopefully the
        // redirect is quick and they never see the loader.
        ReactDOM.render(
          <Loading text="Redirecting to login" loadingDelayMS={ 3000 } style="inline" />
        , mainEl);

        // Stop the routing
        next(false);

        // Hang the promise chain to avoid additional loading and API calls
        const hang = new Promise();
        return hang;
      }

      if (!authStatus) {
        // An error occurred. At this point we're not sure if the user is
        // auth'd or not, but if there's some major error where we can't talk
        // to the API, it's unlikely anything will work. Still, we let the page
        // load. and kick off an error action so the user is aware that
        // something is amiss. Definitely avoid sending them through a login
        // flow which might also be broken.
        const loginError = LoginStore.error;
        return errorActions.noticeError(loginError);
      }

      // Normal page load
      return Promise.resolve();
    })
    .then(() => {
      userActions.fetchCurrentUser({ orgGuid, spaceGuid });
      orgActions.fetchAll();
      spaceActions.fetchAll();
      next();
    });
}

function notFound(next) {
  // Reset the state
  orgActions.changeCurrentOrg();
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();

  ReactDOM.render(<h1>Not Found</h1>, mainEl);
  next();
}

const routes = {
  '/': overview,
  '/dashboard': overview,
  '/login': login,
  '/org': {
    '/:orgGuid': {
      '/spaces': {
        '/:spaceGuid': {
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
  async: true,
  before: checkAuth,
  notfound: notFound,
  on: () => trackPageView(window.location.hash)
});
router.init('/');
