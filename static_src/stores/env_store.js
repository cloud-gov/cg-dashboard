import PropTypes from "prop-types";

import BaseStore from "./base_store";
import { appActionTypes, envActionTypes } from "../constants";

export const envPropType = PropTypes.shape({
  environment_json: PropTypes.object.isRequired
});

export const envRequestPropType = PropTypes.shape({
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  result: envPropType
});

export const updateErrorPropType = PropTypes.shape({
  code: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired
});

export const deleteErrorPropType = updateErrorPropType;

class EnvStore extends BaseStore {
  constructor() {
    super();
    this.envRequests = {};
    this.updateError = {};
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getEnv(appGuid) {
    return (this.envRequests[appGuid] || {}).result;
  }

  getEnvRequest(appGuid) {
    return this.envRequests[appGuid];
  }

  getUpdateError(appGuid) {
    const error = this.updateError[appGuid];
    if (!error) {
      return null;
    }
    const { error_code: errorCode } = error;
    return {
      ...error,
      errorCode
    };
  }

  _registerToActions(action) {
    switch (action.type) {
      case envActionTypes.ENV_FETCH_ENV_REQUEST: {
        const { appGuid } = action;
        this.envRequests[appGuid] = {
          ...this.envRequests[appGuid],
          isFetching: true,
          error: false
        };
        this.emitChange();
        break;
      }
      case envActionTypes.ENV_FETCH_ENV_SUCCESS: {
        const { appGuid, env } = action;
        this.envRequests[appGuid] = {
          ...this.envRequests[appGuid],
          isFetching: false,
          result: env
        };
        this.emitChange();
        break;
      }
      case envActionTypes.ENV_FETCH_ENV_FAILURE: {
        const { appGuid } = action;
        this.envRequests[appGuid] = {
          ...this.envRequests[appGuid],
          isFetching: false,
          error: true
        };
        this.emitChange();
        break;
      }
      case appActionTypes.APP_ERROR: {
        const { appGuid, error: { response: { data: error } = {} } } = action;
        this.updateError[appGuid] = error;
        this.emitChange();
        break;
      }
      case envActionTypes.ENV_INVALIDATE_UPDATE_ERROR: {
        const { appGuid } = action;
        delete this.updateError[appGuid];
        this.emitChange();
        break;
      }
      default:
        break;
    }
  }
}

export default new EnvStore();
