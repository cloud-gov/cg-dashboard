/*
 * Store for generic notification data.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { notificationActionTypes } from '../constants.js';


export class NotificationStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case notificationActionTypes.NOTIFY: {
        const notice = Object.assign({}, { description: action.msg }, action.notice);
        // Put this notice at the top, since it is considered higher priority
        this._data = this._data.unshift(notice);
        this.emitChange();
        break;
      }

      case notificationActionTypes.CLEAR: {
        this._data = new Immutable.List();
        this.emitChange();
        break;
      }
      default:
        break;
    }
  }

  get currentAppGuid() {
    return this._currentAppGuid;
  }
}

const _NotificationStore = new NotificationStore();

export default _NotificationStore;
