
/*
 * Store for route data. Will store and update route data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { appActionTypes, routeActionTypes } from '../constants.js';

class RouteStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.showCreateRouteForm = false;
    this.error = null;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getAllForSpace(spaceGuid) {
    return this.getAll().filter((route) => route.space_guid === spaceGuid);
  }

  mergeRoutes(routes) {
    this.mergeMany('guid', routes, (changed) => {
      if (changed) this.emitChange();
      routes.forEach((route) => {
        if (/shared_domains/.test(route.domain_url)) {
          cfApi.fetchSharedDomain(route.domain_guid);
        } else {
          cfApi.fetchPrivateDomain(route.domain_guid);
        }
      });
    });
  }

  _registerToActions(action) {
    switch (action.type) {
      case appActionTypes.APP_RECEIVED: {
        if (!action.app.routes) break;
        const routes = action.app.routes.map((route) => {
          const r = {
            app_guid: action.app.guid,
            guid: route.guid,
            host: route.host,
            path: route.path,
            domain_guid: route.domain.guid
          };

          return r;
        });

        this.mergeMany('domain_guid', routes, (changed) => {
          if (changed) this.emitChange();
        });

        break;
      }

      case routeActionTypes.ROUTES_RECEIVED: {
        const routes = this.formatSplitResponse(action.routes);
        this.mergeRoutes(routes);
        break;
      }

      case routeActionTypes.ROUTE_APP_ASSOCIATE: {
        cfApi.putAppRouteAssociation(action.appGuid, action.routeGuid);
        break;
      }

      case routeActionTypes.ROUTE_APP_ASSOCIATED: {
        const route = this.get(action.routeGuid);
        const newRoute = Object.assign({}, route, {
          app_guid: action.appGuid,
          editing: false,
          error: null
        });
        this.merge('guid', newRoute, () => {
          this.showCreateRouteForm = false;
          this.error = null;
          this.emitChange();
        });
        break;
      }

      case routeActionTypes.ROUTE_APP_UNASSOCIATE: {
        cfApi.deleteAppRouteAssociation(action.appGuid, action.routeGuid);
        break;
      }

      case routeActionTypes.ROUTE_APP_UNASSOCIATED: {
        const route = this.get(action.routeGuid);
        if (route) {
          const newRoute = Object.assign({}, route, { app_guid: null });
          this.merge('guid', newRoute, () => this.emitChange());
        }
        break;
      }

      case routeActionTypes.ROUTE_CREATE: {
        const { domainGuid, spaceGuid, host, path } = action;
        cfApi.createRoute(domainGuid, spaceGuid, host, path);
        break;
      }

      case routeActionTypes.ROUTE_CREATE_ERROR: {
        this.error = action.error;
        this.emitChange();
        break;
      }

      case routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE: {
        this.emitChange();
        const { appGuid, domainGuid, spaceGuid } = action;
        const { host, path } = action.route;
        cfApi.createRoute(domainGuid, spaceGuid, host, path).then((res) => {
          const routeGuid = res.metadata.guid;
          cfApi.putAppRouteAssociation(appGuid, routeGuid);
        }).catch(() => {
          // Do nothing, error handled in cf_api.js
        });
        break;
      }

      case routeActionTypes.ROUTE_CREATE_FORM_HIDE: {
        this.showCreateRouteForm = false;
        this.error = null;
        this.emitChange();
        break;
      }

      case routeActionTypes.ROUTE_CREATE_FORM_SHOW: {
        this.showCreateRouteForm = true;
        this.error = null;
        this.emitChange();
        break;
      }

      case routeActionTypes.ROUTE_CREATED: {
        const route = this.formatSplitResponse([action.route]).pop();
        this.merge('guid', route, () => this.emitChange());
        break;
      }

      case routeActionTypes.ROUTE_DELETE: {
        cfApi.deleteRoute(action.routeGuid);
        break;
      }

      case routeActionTypes.ROUTE_DELETED: {
        this.delete(action.routeGuid, () => {
          this.emitChange();
        });
        break;
      }

      case routeActionTypes.ROUTES_FOR_APP_FETCH:
        cfApi.fetchRoutesForApp(action.appGuid);
        break;

      case routeActionTypes.ROUTES_FOR_SPACE_FETCH:
        cfApi.fetchRoutesForSpace(action.spaceGuid);
        break;

      case routeActionTypes.ROUTES_FOR_APP_RECEIVED: {
        const routes = this.formatSplitResponse(action.routes).map((route) =>
          Object.assign({}, route, { app_guid: action.appGuid })
        );
        this.mergeRoutes(routes);
        break;
      }

      case routeActionTypes.ROUTE_TOGGLE_EDIT: {
        const route = this.get(action.routeGuid);
        const newRoute = Object.assign({}, route, {
          editing: !route.editing
        });
        this.merge('guid', newRoute, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case routeActionTypes.ROUTE_TOGGLE_REMOVE: {
        const route = this.get(action.routeGuid);
        const newRoute = Object.assign({}, route, {
          removing: !route.removing
        });
        this.merge('guid', newRoute, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case routeActionTypes.ROUTE_UPDATE: {
        const { routeGuid, domainGuid, spaceGuid, route } = action;
        cfApi.putRouteUpdate(routeGuid, domainGuid, spaceGuid, route);
        break;
      }

      case routeActionTypes.ROUTE_UPDATED: {
        const route = Object.assign({}, action.route, {
          editing: false,
          error: null
        });
        this.merge('guid', route, () => {
          this.emitChange();
        });
        break;
      }

      case routeActionTypes.ROUTE_ERROR: {
        const route = this.get(action.routeGuid);
        if (!route) break;
        const newRoute = Object.assign({}, route, {
          error: action.error
        });
        this.merge('guid', newRoute, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }
}

const _RouteStore = new RouteStore();

export default _RouteStore;
