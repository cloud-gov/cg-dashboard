/*
 * Actions for domain entities. Any actions such as fetching, creating,
 * etc should go here.
 */

import AppDispatcher from "../dispatcher.js";
import { domainActionTypes } from "../constants";

export default {
  fetch(domainGuid) {
    AppDispatcher.handleViewAction({
      type: domainActionTypes.DOMAIN_FETCH,
      domainGuid
    });
  },

  receivedDomain(domain) {
    AppDispatcher.handleServerAction({
      type: domainActionTypes.DOMAIN_RECEIVED,
      domain
    });
  }
};
