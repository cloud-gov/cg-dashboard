
/*
 * Includes basic functionality that all stores need.
 */

import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher.js';

export default class BaseStore extends EventEmitter {

  constructor() {
    super();
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = AppDispatcher.register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  emitChange() {
    this.emit('CHANGE');
  }

  addChangeListener(cb) {
    this.on('CHANGE', cb);
  }

  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb);
  }

  _formatSplitRes(resources) {
    return resources.map((resource) => {
      return Object.assign(resource.entity, resource.metadata);
    });
  }

  // TODO make this have no side effects.
  _merge(currents, updates) {
    if (currents.length) {
      updates.forEach(function(update) {
        var same = currents.find(function(current) {
          return current.guid === update.guid;
        });
         
        same ? Object.assign(same, update) : currents.push(update);
      });
    } else {
      currents = updates;
    }
    return currents;
  }
}
