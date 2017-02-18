
import BaseStore from './base_store.js';
import { formActionTypes } from '../constants.js';
import Form from '../models/form';
import FormField from '../models/form_field';


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

    return form.fields.get(fieldName);
  }

  create(formGuid, formData) {
    // Transform formData into FormFields
    const formFieldData = Object.keys(formData)
      .reduce((formFields, fieldName) => {
        const formField = new FormField({
          ...formData[fieldName],
          name: fieldName
        });

        return { ...formFields, [fieldName]: formField };
      }, {});

    const form = new Form({ guid: formGuid })
      .merge({ fields: formFieldData });

    this.push(form);
    return form;
  }

  _registerToActions(action) {
    switch (action.type) {
      case formActionTypes.FORM_FIELD_CHANGE: {
        // Update the form field value
        const form = this.get(action.formGuid, false);
        const changedFormField = form.fields
          .get(action.fieldName)
          .merge({ value: action.fieldValue });

        const changedForm = form.updateFormField(action.fieldName, changedFormField);
        this.merge('guid', changedForm);
        break;
      }

      case formActionTypes.FORM_FIELD_CHANGE_SUCCESS: {
        // Clear any error
        const form = this.get(action.formGuid, false);
        const changedFormField = form.fields
          .get(action.fieldName)
          .merge({ error: null });

        const changedForm = form.updateFormField(action.fieldName, changedFormField);
        this.merge('guid', changedForm);
        break;
      }

      case formActionTypes.FORM_FIELD_CHANGE_ERROR: {
        // Set the error
        const form = this.get(action.formGuid, false);
        const changedFormField = form.fields
          .get(action.fieldName)
          .merge({ error: action.error });

        const changedForm = form.updateFormField(action.fieldName, changedFormField);
        this.merge('guid', changedForm);
        break;
      }

      default:
        break;
    }
  }
}

const _formStore = new FormStore();

export default _formStore;
