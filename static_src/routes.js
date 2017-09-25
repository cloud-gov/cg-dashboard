import activityActions from './actions/activity_actions.js';
import AppContainer from './components/app_container.jsx';
import appActions from './actions/app_actions.js';
import cfApi from './util/cf_api.js';
import errorActions from './actions/error_actions';
import Loading from './components/loading.jsx';
import loginActions from './actions/login_actions';
import LoginStore from './stores/login_store';
import NotFound from './components/not_found.jsx';
import orgActions from './actions/org_actions.js';
import Overview from './components/overview_container.jsx';
import OrgContainer from './components/org_container.jsx';
import pageActions from './actions/page_actions.js';
import quotaActions from './actions/quota_actions.js';
import routeActions from './actions/route_actions.js';
import envActions from './actions/env_actions.js';
import spaceActions from './actions/space_actions.js';
import serviceActions from './actions/service_actions.js';
import SpaceContainer from './components/space_container.jsx';
import { appHealth } from './util/health.js';
import { entityHealth } from './constants.js';
import windowUtil from './util/window';
import userActions from './actions/user_actions.js';
import routerActions from './actions/router_actions.js';

const MAX_OVERVIEW_SPACES = 10;

export function overview(next) {
  pageActions.load();

  // Reset the state
  orgActions.changeCurrentOrg();
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();

  Promise.all([
    orgActions.fetchAll(),
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
  ])
  .then(pageActions.loadSuccess, pageActions.loadError);
  routerActions.navigate(Overview);
  next();
}

export function org(orgGuid, next) {
  // Reset the state
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();

  spaceActions.fetchAll().then(() => {
    orgActions.toggleSpaceMenu(orgGuid);
    orgActions.fetch(orgGuid);
    spaceActions.fetchAllForOrg(orgGuid);
    userActions.changeCurrentlyViewedType('org_users');
    userActions.fetchOrgUsers(orgGuid);
    userActions.fetchOrgUserRoles(orgGuid);
    routerActions.navigate(OrgContainer);
    next();
  });
}

export function space(orgGuid, spaceGuid, next) {
  // Reset the state
  appActions.changeCurrentApp();

  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  cfApi.fetchOrg(orgGuid);
  spaceActions.fetch(spaceGuid);
  serviceActions.fetchAllInstances(spaceGuid);
  userActions.changeCurrentlyViewedType('space_users');
  userActions.fetchOrgUsers(orgGuid);
  userActions.fetchOrgUserRoles(orgGuid);
  userActions.fetchSpaceUserRoles(spaceGuid);
  orgActions.fetch(orgGuid);
  serviceActions.fetchAllServices(orgGuid);
  routerActions.navigate(SpaceContainer, { currentPage: 'apps' });
  next();
}

export function app(orgGuid, spaceGuid, appGuid, next) {
  orgActions.toggleSpaceMenu(orgGuid);
  spaceActions.changeCurrentSpace(spaceGuid);
  orgActions.fetch(orgGuid);
  spaceActions.fetch(spaceGuid);
  activityActions.fetchSpaceEvents(spaceGuid, appGuid);
  activityActions.fetchAppLogs(appGuid);
  quotaActions.fetchAll();
  appActions.changeCurrentApp(appGuid);
  appActions.fetch(appGuid).then((res) => {
    // Only fetch app stats when the app is running, otherwise the stats
    // request will fail.
    if (appHealth(res) === entityHealth.ok) {
      appActions.fetchStats(appGuid);
    }
  });
  routeActions.fetchRoutesForSpace(spaceGuid);
  routeActions.fetchRoutesForApp(appGuid);
  envActions.fetchEnv(appGuid);
  serviceActions.fetchAllInstances(spaceGuid);
  serviceActions.fetchServiceBindings();
  routerActions.navigate(AppContainer);
  next();
}

export function checkAuth(...args) {
  const next = args.pop();

  // These may or may not be set depending on route
  const [orgGuid, spaceGuid] = args;

  loginActions
    .fetchStatus()
    .then(authStatus => {
      if (!authStatus) {
        // An error occurred. At this point we're not sure if the user is
        // auth'd or not, but if there's some major error where we can't talk
        // to the API, it's unlikely anything will work. Still, we let the page
        // load. and kick off an error action so the user is aware that
        // something is amiss. Definitely avoid sending them through a login
        // flow which might also be broken.
        return errorActions.noticeError(LoginStore.error);
      }

      if (authStatus.status === 'authorized') {
        // Normal page load
        return Promise.resolve();
      }

      // Show a redirect loading component in case of slow connection
      routerActions.navigate(Loading, {
        text: 'Redirecting to login',
        loadingDelayMS: 3000,
        style: 'inline'
      });

      // Redirect the user to the cloud.gov login page
      return Promise.reject(windowUtil.redirect('/handshake'));
    })
    .then(() => {
      userActions.fetchCurrentUser({ orgGuid, spaceGuid });
      next();
    })
    .catch(() => next(false));
}

export function clearErrors(...args) {
  const next = args.pop();
  errorActions.clearErrors();
  next();
}

export function notFound(next) {
  // Reset the state
  orgActions.changeCurrentOrg();
  spaceActions.changeCurrentSpace();
  appActions.changeCurrentApp();
  routerActions.navigate(NotFound);
  next();
}

const routes = {
  '/': overview,
  '/dashboard': overview,
  '/org': {
    '/:orgGuid': {
      '/spaces': {
        '/:spaceGuid': {
          '/apps': {
            '/:appGuid': {
              on: app
            },
            on: space
          },
          on: space
        }
      },
      on: org
    }
  }
};

export default routes;
