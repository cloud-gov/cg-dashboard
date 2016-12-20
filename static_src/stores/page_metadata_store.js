import BaseStore from './base_store.js';
import { pageMetadataTypes } from '../constants';
import { PageMetadataModel } from '../models';


export class PageMetadataStore extends BaseStore {
  constructor() {
    super();
    this.current = new PageMetadataModel();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case pageMetadataTypes.PAGE_METADATA_UPDATE: {
        if (this.current.equals(action.pageMetadata)) {
          break;
        }

        this.current = this.current.merge(action.pageMetadata);
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }
}

const _PageMetadataStore = new PageMetadataStore();

export default _PageMetadataStore;
