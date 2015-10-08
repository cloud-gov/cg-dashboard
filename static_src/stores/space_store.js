
import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this._data = [];
  }

  get(guid) {
    return this._data.find((space) => {
      return space.guid === guid;
    });
  }
}

let _SpaceStore = new SpaceStore();

export default _SpaceStore;
