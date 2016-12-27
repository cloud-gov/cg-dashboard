import AppDispatcher from '../dispatcher.js';
import { pageMetadataTypes } from '../constants';

export default {
  update(pageMetadata) {
    AppDispatcher.handleViewAction({
      type: pageMetadataTypes.PAGE_METADATA_UPDATE,
      pageMetadata
    });
  },

  loadPage(kind) {
    AppDispatcher.handleViewAction({
      type: pageMetadataTypes.PAGE_METADATA_LOAD_PAGE,
      kind
    });
  },

  unloadPage() {
    AppDispatcher.handleViewAction({
      type: pageMetadataTypes.PAGE_METADATA_UNLOAD_PAGE
    });
  }
};
