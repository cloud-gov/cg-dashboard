
import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import { orgActionTypes } from '../constants.js';

function formatData(resources) {
  return resources.map((resource) => {
    return Object.assign(resource.entity, resource.metadata);
  });
}

class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORGS_RECEIVED:
        this._data = formatData(action.orgs);
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get(guid) {
    return this._data.find((org) => {
      return org.guid === guid;
    });
  }

  getAll() {
    return this._data;
  }
}

let _OrgStore = new OrgStore();

export default _OrgStore;
