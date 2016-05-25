
/*
 * Includes basic functionality that all stores need.
 */

import { EventEmitter } from 'events';
import Immutable from 'immutable';

import AppDispatcher from '../dispatcher.js';

function defaultChangedCallback(changed) {
  if (changed) this.emitChange();
}

export default class BaseStore extends EventEmitter {

  constructor() {
    super();
    this._data = new Immutable.List();
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = AppDispatcher.register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  isEmpty() {
    if (this._data.count() === 0) return true;
    return false;
  }

  push(val) {
    const newData = Immutable.fromJS(val);
    this._data = this._data.push(newData);
    this.emitChange();

    return this._data;
  }

  get(guid) {
    if (guid && !this.isEmpty()) {
      const item = this._data.find((space) =>
        space.get('guid') === guid
      );

      if (item) return item.toJS();
    }
    return undefined;
  }

  getAll() {
    return this._data.toJS();
  }

  dataHasChanged(toCompare) {
    const c = Immutable.fromJS(toCompare);
    return !Immutable.is(this._data, c);
  }

  formatSplitResponse(resources) {
    return resources.map((r) => Object.assign(r.entity, r.metadata));
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

  // TODO determine if we can remove this function
  _merge(currents, updates) {
    if (!currents.length) return updates;

    updates.forEach((update) => {
      const same = currents.find((current) =>
        current.guid === update.guid
      );

      if (same) {
        Object.assign(same, update);
      } else {
        currents.push(update);
      }
    });

    return currents;
  }

  /* merge with no side effects
   *
   * If the dataToMerge exists in the store (as found by
   * the mergeKey), then merge in new data if there are
   * changes. If it does not exist in the store, add it.
   * When data changes, calls dataChangedCallback with
   * true as the argument. Otherwise, false is used
   *
   * @param {string} mergeKey - use to match objects
   * @param {object} dataToMerge - new object with data
   * @param {fn} cb - defaults to calling this.emitChange()
   *                  when the store's data has changed
   *
   */
  merge(mergeKey, dataToMerge, cb = defaultChangedCallback.bind(this)) {
    const toMerge = Immutable.fromJS(dataToMerge);
    const oldDataItem = this._data.find((d) =>
      d.get(mergeKey) === toMerge.get(mergeKey)
    );

    if (oldDataItem) {
      if (Immutable.is(oldDataItem, toMerge)) {
        return cb(false);
      }

      this._data = this._data.map((d) => {
        if (Immutable.is(d, oldDataItem)) {
          return oldDataItem.merge(toMerge);
        }
        return d;
      });
    } else {
      this._data = this._data.push(toMerge);
    }
    return cb(true);
  }

  mergeMany(mergeKey, arrayOfDataToMerge, cb = defaultChangedCallback.bind(this)) {
    let dataHasChanged = false;
    arrayOfDataToMerge.forEach((newData) => {
      this.merge(mergeKey, newData, (changed) => {
        if (changed) dataHasChanged = true;
      });
    });

    cb(dataHasChanged);
  }
}
