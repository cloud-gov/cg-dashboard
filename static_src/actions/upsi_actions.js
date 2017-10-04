import AppDispatcher from '../dispatcher';
import { upsiActionTypes } from '../constants';
import cfApi from '../util/cf_api';

const fetchAllSuccess = items => {
  AppDispatcher.handleServerAction({
    type: upsiActionTypes.UPSI_FETCH_ALL_SUCCESS,
    items
  });

  return Promise.resolve({ items });
};

const fetchAllFailure = err => {
  AppDispatcher.handleServerAction({
    type: upsiActionTypes.UPSI_FETCH_ALL_FAILURE
  });

  return Promise.resolve({ err });
};

const fetchAllForSpaceSuccess = (spaceGuid, items) => {
  AppDispatcher.handleServerAction({
    type: upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_SUCCESS,
    spaceGuid,
    items
  });

  return Promise.resolve({ spaceGuid, items });
};

const fetchAllForSpaceFailure = (spaceGuid, err) => {
  AppDispatcher.handleServerAction({
    type: upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_FAILURE,
    spaceGuid
  });

  return Promise.resolve({ spaceGuid, err });
};

export default {
  fetchAll() {
    AppDispatcher.handleViewAction({
      type: upsiActionTypes.UPSI_FETCH_ALL_REQUEST
    });

    return cfApi
      .fetchAllUPSI()
      .then(data => fetchAllSuccess(data), err => fetchAllFailure(err));
  },

  fetchAllForSpace(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_REQUEST,
      spaceGuid
    });

    return cfApi
      .fetchAllUPSI({
        q: [{ filter: 'space_guid', op: ':', value: spaceGuid }]
      })
      .then(
        data => fetchAllForSpaceSuccess(spaceGuid, data),
        err => fetchAllForSpaceFailure(err)
      );
  }
};
