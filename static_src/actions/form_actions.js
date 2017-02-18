
/*
 * Actions for app entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { formActionTypes } from '../constants';
import FormStore from '../stores/form_store';

const formActions = {
  changeField(formGuid, fieldName, fieldValue) {
    AppDispatcher.handleUIAction({
      type: formActionTypes.FORM_FIELD_CHANGE,
      formGuid,
      fieldName,
      fieldValue
    });

    // Validate the change
    const formField = FormStore.getFormField(formGuid, fieldName);
    const error = formField.validate();

    const promise = error ?
      formActions.changeFieldError(formGuid, fieldName, error) :
      formActions.changeFieldSuccess(formGuid, fieldName);

    return promise.then(() => formField);
  },

  changeFieldSuccess(formGuid, fieldName) {
    AppDispatcher.handleUIAction({
      type: formActionTypes.FORM_FIELD_CHANGE_SUCCESS,
      formGuid,
      fieldName
    });

    return Promise.resolve();
  },

  changeFieldError(formGuid, fieldName, error) {
    AppDispatcher.handleUIAction({
      type: formActionTypes.FORM_FIELD_CHANGE_ERROR,
      formGuid,
      fieldName,
      error
    });

    return Promise.resolve();
  }
};

export default formActions;
