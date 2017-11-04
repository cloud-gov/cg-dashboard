import PropTypes from 'prop-types';

import BaseStore from './base_store';
import { upsiActionTypes } from '../constants';

export const upsisPropType = PropTypes.arrayOf(
  PropTypes.shape({
    guid: PropTypes.string.isRequired
  })
);

export const upsiPropType = PropTypes.shape({
  guid: PropTypes.string.isRequired
});

export const upsisRequestPropType = PropTypes.shape({
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  items: upsisPropType
});

class UPSIStore extends BaseStore {
  constructor() {
    super();
    this.allRequest = {};
    this.allForSpaceRequests = {};
    this.subscribe(() => this.reduce.bind(this));
  }

  getAllRequest() {
    return this.allRequest;
  }

  getAllForSpaceRequest(spaceGuid) {
    return this.allForSpaceRequests[spaceGuid];
  }

  reduce(action) {
    switch (action.type) {
      case upsiActionTypes.UPSI_FETCH_ALL_REQUEST: {
        this.allRequest = {
          ...this.allRequest,
          isFetching: true,
          error: false
        };
        this.emitChange();
        break;
      }
      case upsiActionTypes.UPSI_FETCH_ALL_SUCCESS: {
        const { items } = action;
        this.allRequest = {
          ...this.allRequest,
          isFetching: false,
          items
        };
        this.emitChange();
        break;
      }
      case upsiActionTypes.UPSI_FETCH_ALL_FAILURE: {
        this.allRequest = {
          ...this.allRequest,
          isFetching: false,
          error: true
        };
        this.emitChange();
        break;
      }
      case upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_REQUEST: {
        const { spaceGuid } = action;
        this.allForSpaceRequests[spaceGuid] = {
          ...this.allForSpaceRequests[spaceGuid],
          isFetching: true,
          error: false
        };
        this.emitChange();
        break;
      }
      case upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_SUCCESS: {
        const { spaceGuid, items } = action;
        this.allForSpaceRequests[spaceGuid] = {
          ...this.allForSpaceRequests[spaceGuid],
          isFetching: false,
          items
        };
        this.emitChange();
        break;
      }
      case upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_FAILURE: {
        const { spaceGuid } = action;
        this.allForSpaceRequests[spaceGuid] = {
          ...this.allForSpaceRequests[spaceGuid],
          isFetching: false,
          error: true
        };
        this.emitChange();
        break;
      }
      default:
        break;
    }
  }
}

export default new UPSIStore();
