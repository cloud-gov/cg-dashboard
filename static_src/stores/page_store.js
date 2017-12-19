import BaseStore from "./base_store.js";
import { pageActionTypes } from "../constants.js";

class PageStore extends BaseStore {
  constructor() {
    super();
    this.isLoading = false;
    this.subscribe(() => this.handleAction.bind(this));
  }

  handleAction(action) {
    switch (action.type) {
      case pageActionTypes.PAGE_LOAD_STARTED: {
        this.isLoading = true;
        this.emitChange();
        break;
      }

      case pageActionTypes.PAGE_LOAD_ERROR:
      case pageActionTypes.PAGE_LOAD_SUCCESS: {
        this.isLoading = false;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
}

export default new PageStore();
