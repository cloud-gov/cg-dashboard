import AppDispatcher from '../dispatcher';
import { upsActionTypes } from '../constants';

export default {
  fetchAll() {
    AppDispatcher.handleViewAction({
      type: upsActionTypes.UPSI_FETCH_ALL
    });
  },

  receivedAll(items) {
    AppDispatcher.handleServerAction({
      type: upsActionTypes.UPSI_RECEIVED_ALL,
      items
    });
  },

  fetchAllForSpace(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: upsActionTypes.UPSI_FETCH_ALL_FOR_SPACE,
      spaceGuid
    });
  },

  receivedAllForSpace(items, { spaceGuid }) {
    AppDispatcher.handleServerAction({
      type: upsActionTypes.UPSI_RECEIVED_ALL_FOR_SPACE,
      items,
      spaceGuid
    });
  }
};
