
/*
 * Store for route data. Will store and update route data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { routeActionTypes } from '../constants.js';

class RouteStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case routeActionTypes.ROUTES_FOR_APP_FETCH:
        cfApi.fetchRoutesForApp(action.appGuid);
        break;

      case routeActionTypes.ROUTES_FOR_APP_RECEIVED: {
        const routes = this.formatSplitResponse(action.routes).map((route) =>
          Object.assign({}, route, { appGuid: action.appGuid })
        );
        this.mergeMany('guid', routes, (changed) => {
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
