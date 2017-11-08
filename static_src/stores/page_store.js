import BaseStore from "./base_store.js";
import { pageActionTypes } from "../constants.js";

class PageStore extends BaseStore {
  constructor() {
    super();
    this._loading = false;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  get loading() {
    return this._loading;
  }

  _registerToActions(action) {
    switch (action.type) {
      case pageActionTypes.PAGE_LOAD_STARTED: {
        this._loading = true;
        this.emitChange();
        break;
      }

      case pageActionTypes.PAGE_LOAD_ERROR:
      case pageActionTypes.PAGE_LOAD_SUCCESS: {
        this._loading = false;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
}

export default new PageStore();
