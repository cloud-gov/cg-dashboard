/*
 * Store for generic notification data.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { notificationActionTypes } from '../constants.js';


export class NotificationStore extends BaseStore {
  constructor() {
    super();
    this.maxNotices = 3;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  checkForMaxFetchNotices() {
    const notices = this.getAll();
    if (notices.length >= this.maxNotices) {
      // If too many errors, clear them and provide a generic fetch one.
      this._data = new Immutable.List();
      const genericFetchNotice = {
        description: 'Connection issue, please try again'
      };
      this.push(genericFetchNotice);
    }
  }

  _registerToActions(action) {
    switch (action.type) {
      case notificationActionTypes.NOTIFY: {
        const notice = Object.assign({}, action.notice);
        // Put this error at the top, since it is considered higher priority
        this._data = this._data.unshift(notice);
        break;
      }

      case notificationActionTypes.IMPORTANT_FETCH: {
        const notice = Object.assign({}, { description: action.msg }, action.notice);
        this.push(notice);
        this.checkForMaxFetchNotices();
        break;
      }

      case notificationActionTypes.DISMISS: {
        const noticeIdx = this.getAll().findIndex((notice) => notice === action.notice);
        if (noticeIdx) {
          // TODO little unsafe to access data here?
          this._data = this._data.delete(noticeIdx);
          this.emitChange();
        }
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

const _NoticeStore = new NoticeStore();

export default _NoticeStore;
