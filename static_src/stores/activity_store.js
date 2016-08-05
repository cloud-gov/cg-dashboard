
import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { activityActionTypes } from '../constants.js';

class ActivityStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    let activity;
    switch (action.type) {
      case activityActionTypes.ACTIVITY_FETCH:
        cfApi.fetchSpaceEvents(action.spaceGuid);
        break;

      case activityActionTypes.ACTIVITY_RECEIVED:
        activity = this.formatSplitResponse(action.activity);
        this.mergeMany('guid', activity, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      default:
        break;
    }
  }
}

const _ActivityStore = new ActivityStore();

export default _ActivityStore;
