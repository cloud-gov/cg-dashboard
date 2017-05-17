
/**
 * Renders a form that allows org users to invite new users
 * to cloud.gov
 */

import React from 'react';

import Action from './action.jsx';
import FormStore from '../stores/form_store';
import { Form, FormText } from './form';
import PanelDocumentation from './panel_documentation.jsx';
import userActions from '../actions/user_actions';
import { validateString } from '../util/validators';

const USERS_INVITE_FORM_GUID = 'users-invite-form';

export default class UsersInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    FormStore.create(USERS_INVITE_FORM_GUID);

    this.validateString = validateString().bind(this);
    this._onChange = this._onChange.bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  _onChange() {

  }

  _onValidForm(errs, values) {
    userActions.fetchUserInvite(values.email.value);
  }

  render() {
    return (
      <div className="test-users-invite">
        <h2>User invite</h2>
        <PanelDocumentation>
          <p>Organizational Managers can add new users below.</p>
        </PanelDocumentation>
        <Form
          guid={ USERS_INVITE_FORM_GUID }
          classes={ ['users_invite_form'] }
          ref="form"
          onSubmit={ this._onValidForm }
        >
          <legend>
            Invite a new user
          </legend>
          <FormText
            formGuid={ USERS_INVITE_FORM_GUID }
            classes={ ['test-users_invite_name'] }
            label="User's email"
            name="email"
            validator={ this.validateString }
          />
          <Action label="submit" type="submit">Invite new user</Action>
        </Form>
      </div>
    );
  }

}

UsersInvite.propTypes = { };

UsersInvite.defaultProps = { };
