
import Immutable from 'immutable';
import FormField from './form_field';


const defaults = {
  errors: new Immutable.List(),
  fields: new Immutable.Map(),
  guid: null
};

/* eslint-disable new-cap */
export default class Form extends Immutable.Record(defaults, 'Form') {
/* eslint-enable new-cap */

  addFormField(fieldName, data) {
    const formField = new FormField({ ...data, name: fieldName });
    this.fields = this.fields.set(fieldName, formField);
    return formField;
  }

  updateFormField(fieldName, formField) {
    const updatedFields = this.fields.set(fieldName, formField);
    return this.set('fields', updatedFields);
  }

  validate() {
    return this.fields.reduce((errors, field) => {
      const err = field.validate();
      if (err) {
        errors.push(err);
      }

      return errors;
    }, new Immutable.List());
  }
}
