import AppDispatcher from "../dispatcher";
import { envActionTypes } from "../constants";
import cfApi from "../util/cf_api";

const fetchEnvSuccess = (appGuid, env) => {
  AppDispatcher.handleServerAction({
    type: envActionTypes.ENV_FETCH_ENV_SUCCESS,
    appGuid,
    env
  });

  return Promise.resolve({ appGuid, env });
};

const fetchEnvFailure = (appGuid, err) => {
  AppDispatcher.handleServerAction({
    type: envActionTypes.ENV_FETCH_ENV_FAILURE,
    appGuid
  });

  return Promise.resolve({ appGuid, err });
};

export default {
  fetchEnv(appGuid) {
    AppDispatcher.handleViewAction({
      type: envActionTypes.ENV_FETCH_ENV_REQUEST,
      appGuid
    });

    return cfApi
      .fetchEnv(appGuid)
      .then(
        res => fetchEnvSuccess(appGuid, res.data),
        err => fetchEnvFailure(appGuid, err)
      );
  },

  invalidateUpdateError(appGuid) {
    AppDispatcher.handleViewAction({
      type: envActionTypes.ENV_INVALIDATE_UPDATE_ERROR,
      appGuid
    });

    return Promise.resolve();
  },

  invalidateDeleteError(appGuid) {
    return this.invalidateUpdateError(appGuid);
  }
};
