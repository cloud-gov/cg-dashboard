
import BaseStore from './base_store.js';
import { formActionTypes } from '../constants.js';


export class FormStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  getFormField(formGuid, fieldName) {
    const form = this.get(formGuid, false);
    if (!form) {
      return null;
    }

    return form.fields[fieldName];
  }

  create(formGuid, initialData) {
    const formFields = Object.keys(initialData || {})
      .reduce((fields, fieldName) => {
        const formField = {
          name: fieldName,
          value: initialData[fieldName]
        };

        return { ...fields, [fieldName]: formField };
      }, {});

    const form = { guid: formGuid, fields: formFields };
    this.push(form);
    return form;
  }

  _registerToActions(action) {
    switch (action.type) {
      case formActionTypes.FORM_FIELD_CHANGE: {
        // Update the form field value
        const form = this.get(action.formGuid);
        const changedFormField = Object.assign(
          {},
          form.fields[action.fieldName],
          { value: action.fieldValue }
        );

        form.fields[action.fieldName] = changedFormField;
        this.merge('guid', form);
        break;
      }

      case formActionTypes.FORM_FIELD_CHANGE_SUCCESS: {
        // Clear any error
        const form = this.get(action.formGuid);
        const changedFormField = Object.assign(
          {},
          form.fields[action.fieldName],
          { error: null }
        );

        form.fields[action.fieldName] = changedFormField;
        this.merge('guid', form);
        break;
      }

      case formActionTypes.FORM_FIELD_CHANGE_ERROR: {
        // Set the error
        const form = this.get(action.formGuid);
        const changedFormField = Object.assign(
          {},
          form.fields[action.fieldName],
          { error: action.error }
        );

        form.fields[action.fieldName] = changedFormField;
        this.merge('guid', form);
        break;
      }

      default:
        break;
    }
  }
}

const _formStore = new FormStore();

export default _formStore;
