
/*
 * Actions for route entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { routeActionTypes } from '../constants';

export default {
  associateApp(routeGuid, appGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_APP_ASSOCIATE,
      appGuid,
      routeGuid
    });
  },

  associatedApp(routeGuid, appGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_APP_ASSOCIATED,
      appGuid,
      routeGuid
    });
  },

  createRoute(domainGuid, spaceGuid, route) {
    const { host, path } = route;
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_CREATE,
      domainGuid,
      spaceGuid,
      host,
      path
    });
  },

  errorCreateRoute(err) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTE_CREATE_ERROR,
      error: err
    });
  },

  createdRoute(route) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTE_CREATED,
      route
    });
  },

  createRouteAndAssociate(appGuid, domainGuid, spaceGuid, route) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE,
      appGuid,
      domainGuid,
      spaceGuid,
      route
    });
  },

  deleteRoute(routeGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_DELETE,
      routeGuid
    });
  },

  deletedRoute(routeGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_DELETED,
      routeGuid
    });
  },

  fetchRoutesForApp(appGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTES_FOR_APP_FETCH,
      appGuid
    });
  },

  hideCreateForm() {
    AppDispatcher.handleUIAction({
      type: routeActionTypes.ROUTE_CREATE_FORM_HIDE
    });
  },

  receivedRoutesForApp(routes, appGuid) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTES_FOR_APP_RECEIVED,
      routes,
      appGuid
    });
  },

  showCreateForm() {
    AppDispatcher.handleUIAction({
      type: routeActionTypes.ROUTE_CREATE_FORM_SHOW
    });
  },

  toggleEdit(routeGuid) {
    AppDispatcher.handleUIAction({
      type: routeActionTypes.ROUTE_TOGGLE_EDIT,
      routeGuid
    });
  },

  updateRoute(routeGuid, domainGuid, spaceGuid, route) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTE_UPDATE,
      routeGuid,
      domainGuid,
      spaceGuid,
      route
    });
  },

  updatedRoute(routeGuid, route) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTE_UPDATED,
      routeGuid,
      route
    });
  },

  error(routeGuid, err) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTE_ERROR,
      routeGuid,
      error: err
    });
  }
};
