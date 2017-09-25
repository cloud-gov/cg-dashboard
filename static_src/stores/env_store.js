import BaseStore from './base_store';
import cfApi from '../util/cf_api';
import { envActionTypes } from '../constants';

class EnvStore extends BaseStore {
  constructor() {
    super();
    this.env = {};
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getEnvForApp(appGuid) {
    return this.env[appGuid];
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
      default:
        break;
    }
  }
}

export default new EnvStore();
