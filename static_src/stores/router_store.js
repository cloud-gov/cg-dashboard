import BaseStore from "./base_store.js";
import { routerActionTypes } from "../constants.js";

class RouterStore extends BaseStore {
  constructor() {
    super();

    this.routeComponent = {};
    this.subscribe(() => this.registerToActions.bind(this));
  }

  registerToActions(action) {
    const { type, data } = action;

    switch (type) {
      case routerActionTypes.NAVIGATE:
        this.routeComponent = Object.assign({}, { ...data });
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get component() {
    return this.routeComponent;
  }
}

export default new RouterStore();
