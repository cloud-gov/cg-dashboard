
import Immutable from 'immutable';


const defaults = {
  error: null,
  name: null,
  value: '',
  validator: () => null
};

/* eslint-disable new-cap */
export default class FormField extends Immutable.Record(defaults, 'FormField') {
/* eslint-enable new-cap */

  validate() {
    return this.validator(this.value, this.name);
  }
}
