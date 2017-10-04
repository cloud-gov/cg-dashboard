import BaseStore from './base_store';
import cfApi from '../util/cf_api';
import { upsActionTypes } from '../constants';
import upsActions from '../actions/upsi_actions';

class UPSIStore extends BaseStore {
  constructor() {
    super();
    this.upsis = {};
    this.allUPSIs = [];
    this.upsisForSpace = {};
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getAll() {
    return this.allUPSIs.map(guid => this.upsis[guid]);
  }

  getAllForSpace(spaceGuid) {
    return (this.upsisForSpace[spaceGuid] || []).map(guid => this.upsis[guid]);
  }

  _registerToActions(action) {
    switch (action.type) {
      case upsActionTypes.UPSI_FETCH_ALL: {
        cfApi.fetchAllUPSI({ action: upsActions.receivedAll });
        break;
      }
      case upsActionTypes.UPSI_RECEIVED_ALL: {
        const { items } = action;
        for (const ups of items) {
          this.upsis[ups.guid] = ups;
        }
        this.allUPSIs = items.map(upsi => upsi.metadata.guid);
        this.emitChange();
        break;
      }
      case upsActionTypes.UPSI_FETCH_ALL_FOR_SPACE: {
        const { spaceGuid } = action;
        cfApi.fetchAllUPSI(
          { action: upsActions.receivedAllForSpace, spaceGuid },
          { q: [{ filter: 'space_guid', op: ':', value: spaceGuid }] }
        );
        break;
      }
      case upsActionTypes.UPSI_RECEIVED_ALL_FOR_SPACE: {
        const { items, spaceGuid } = action;
        for (const ups of items) {
          this.upsis[ups.guid] = ups;
        }
        this.upsisForSpace[spaceGuid] = items.map(ups => ups.guid);
        this.emitChange();
        break;
      }
      default:
        break;
    }
  }
}

export default new UPSIStore();
