
/*
 * Actions for route entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { routeActionTypes } from '../constants';

export default {
  fetchRoutesForApp(appGuid) {
    AppDispatcher.handleViewAction({
      type: routeActionTypes.ROUTES_FOR_APP_FETCH,
      appGuid
    });
  },

  receivedRoutesForApp(routes, appGuid) {
    AppDispatcher.handleServerAction({
      type: routeActionTypes.ROUTES_FOR_APP_RECEIVED,
      routes,
      appGuid
    });
  },

  toggleEdit(routeGuid) {
    AppDispatcher.handleUIAction({
      type: routeActionTypes.ROUTE_TOGGLE_EDIT,
      routeGuid
    });
  }
};
