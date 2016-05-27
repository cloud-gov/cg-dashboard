
import {Dispatcher} from 'flux';

function sendActionToGoogleAnalytics(action) {

}

class AppDispatcher extends Dispatcher {
  // User agent initiated actions that generally require data fetching
  // State mutations are related to core data domains like orgs, spaces, etc
  handleViewAction(action) {
    action.source = 'VIEW_ACTION';
    this.dispatch(action);
    console.log('::action::', action);
    sendActionToGoogleAnalytics(action);
  }

  // UI actions are things like clicking to expand a menu
  // State side affects should just be UI related state
  handleUIAction(action) {
    action.source = 'UI_ACTION';
    this.dispatch(action);
    console.log('::action::', action);
    sendActionToGoogleAnalytics(action);
  }

  // Server actions come from the network/API
  handleServerAction(action) {
    action.source = 'SERVER_ACTION';
    this.dispatch(action);
    console.log('::action::', action);
    sendActionToGoogleAnalytics(action);
  }
}

let _AppDispatcher = new AppDispatcher();

export default _AppDispatcher;
