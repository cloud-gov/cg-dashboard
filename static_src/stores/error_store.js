/*
 * Store for generic error data.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { errorActionTypes } from '../constants.js';


export class ErrorStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case errorActionTypes.IMPORTANT_FETCH: {
        const err = Object.assign({}, { description: action.msg }, action.err);
        this.push(err);
        this.emitChange();
        break;
      }

      case errorActionTypes.DISMISS: {
        const errIdx = this.getAll().findIndex((err) => err === action.err);
        if (errIdx) {
          // TODO little unsafe to access data here?
          this._data = this._data.delete(errIdx);
          this.emitChange();
        }
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

const _ErrorStore = new ErrorStore();

export default _ErrorStore;
