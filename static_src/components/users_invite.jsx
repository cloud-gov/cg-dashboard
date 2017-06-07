
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

const propTypes = {
  error: React.PropTypes.object
};
const defaultProps = {};

export default class UsersInvite extends React.Component {
  constructor(props) {
    super(props);
    FormStore.create(USERS_INVITE_FORM_GUID);

    this.validateString = validateString().bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  _onValidForm(errs, values) {
    userActions.fetchUserInvite(values.email.value);
  }

  get errorMessage() {
    const err = this.props.error;
    if (!err) return undefined;
    const message = err.contextualMessage;
    if (err.message) {
      return `${message}: ${err.message}.`;
    }
    return message;
  }

  render() {
    return (
      <div className="test-users-invite">
        <Form
          guid={ USERS_INVITE_FORM_GUID }
          classes={ ['users_invite_form'] }
          ref="form"
          onSubmit={ this._onValidForm }
          errorOverride={ this.errorMessage }
        >
          <h3>User invite</h3>
          <PanelDocumentation description>
            <p>Organizational Managers can add new users below.</p>
          </PanelDocumentation>
          <FormText
            formGuid={ USERS_INVITE_FORM_GUID }
            classes={ ['test-users_invite_name'] }
            label="Email address"
            name="email"
            validator={ this.validateString }
          />
          <Action label="submit" type="submit">Invite new user</Action>
        </Form>
      </div>
    );
  }

}

UsersInvite.propTypes = propTypes;

UsersInvite.defaultProps = defaultProps;
