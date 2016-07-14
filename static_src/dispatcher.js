
import { Dispatcher } from 'flux';

import { trackAction } from './util/analytics';

const PRODUCTION = ('production' === process.env.NODE_ENV);

function logAction(action) {
  console.log('::action::', action);
}

function addSourceType(srcObj, srcType) {
  return Object.assign({}, srcObj, {
    source: srcType
  });
}

class AppDispatcher extends Dispatcher {
  // User agent initiated actions that generally require data fetching
  // State mutations are related to core data domains like orgs, spaces, etc
  handleViewAction(srcAction) {
    const action = addSourceType(srcAction, 'VIEW_ACTION');
    this.dispatch(action);
    logAction(action);
    if (PRODUCTION) trackAction(action);
  }

  // UI actions are things like clicking to expand a menu
  // State side affects should just be UI related state
  handleUIAction(srcAction) {
    const action = addSourceType(srcAction, 'UI_ACTION');
    this.dispatch(action);
    logAction(action);
    if (PRODUCTION) trackAction(action);
  }

  // Server actions come from the network/API
  handleServerAction(srcAction) {
    const action = addSourceType(srcAction, 'SERVER_ACTION');
    this.dispatch(action);
    logAction(action);
    if (PRODUCTION) trackAction(action);
  }
}

const _AppDispatcher = new AppDispatcher();

export default _AppDispatcher;
