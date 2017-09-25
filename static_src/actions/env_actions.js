import AppDispatcher from '../dispatcher';
import { envActionTypes } from '../constants';

export default {
  fetchEnv(appGuid) {
    AppDispatcher.handleViewAction({
      type: envActionTypes.ENV_FOR_APP_FETCH,
      appGuid
    });
  },

  receivedEnv(env, appGuid) {
    AppDispatcher.handleServerAction({
      type: envActionTypes.ENV_FOR_APP_RECEIVED,
      env,
      appGuid
    });
  }
};
