import BaseStore from './base_store';
import cfApi from '../util/cf_api';
import { appActionTypes, envActionTypes } from '../constants';

class EnvStore extends BaseStore {
  constructor() {
    super();
    this.env = {};
    this.updateError = {};
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getEnv(appGuid) {
    return this.env[appGuid];
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
      case envActionTypes.ENV_FOR_APP_FETCH:
        cfApi.fetchEnv(action.appGuid);
        break;
      case envActionTypes.ENV_FOR_APP_RECEIVED: {
        const { appGuid, env } = action;
        this.env[appGuid] = env;
        this.emitChange();
        break;
      }
      case appActionTypes.APP_ERROR: {
        const { appGuid, error: { response: { data: error } } } = action;
        this.updateError[appGuid] = error;
        this.emitChange();
        break;
      }
      case envActionTypes.INVALIDATE_UPDATE_ERROR: {
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
