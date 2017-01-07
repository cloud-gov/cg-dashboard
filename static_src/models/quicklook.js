import Immutable from 'immutable';


const defaults = {
  isLoaded: false,
  open: false
};

/* eslint-disable new-cap */
export default class Quicklook extends Immutable.Record(defaults, 'Quicklook') {
/* eslint-enable new-cap */
}
