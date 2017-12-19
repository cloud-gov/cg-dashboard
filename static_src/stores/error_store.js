/*
 * Store for generic error data.
 */

import Immutable from "immutable";

import BaseStore from "./base_store.js";
import { errorActionTypes } from "../constants.js";

export class ErrorStore extends BaseStore {
  constructor() {
    super();
    this.maxErrors = 3;
    this.subscribe(() => this.handleAction.bind(this));
  }

  checkForMaxFetchErrors() {
    const errs = this.getAll();
    if (errs.length >= this.maxErrors) {
      // If too many errors, clear them and provide a generic fetch one.
      this.storeData = new Immutable.List();
      const genericFetchError = {
        description: "Connection issue, please try again"
      };
      this.push(genericFetchError);
    }
  }

  handleAction(action) {
    switch (action.type) {
      case errorActionTypes.NOTIFY: {
        const err = Object.assign({}, action.err);
        // Put this error at the top, since it is considered higher priority
        this.storeData = this.storeData.unshift(err);
        break;
      }

      case errorActionTypes.IMPORTANT_FETCH: {
        const err = Object.assign({}, { description: action.msg }, action.err);
        this.push(err);
        this.checkForMaxFetchErrors();
        break;
      }

      case errorActionTypes.DISMISS: {
        const errIdx = this.getAll().findIndex(err => err === action.err);
        if (errIdx) {
          // TODO little unsafe to access data here?
          this.storeData = this.storeData.delete(errIdx);
          this.emitChange();
        }
        break;
      }

      case errorActionTypes.CLEAR: {
        this.storeData = new Immutable.List();
        this.emitChange();
        break;
      }
      default:
        break;
    }
  }
}

export default new ErrorStore();
