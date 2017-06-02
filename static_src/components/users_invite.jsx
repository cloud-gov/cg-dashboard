
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
  inviteDisabled: React.PropTypes.bool,
  currentUserAccess: React.PropTypes.bool,
  error: React.PropTypes.object
};
const defaultProps = {};

function stateSetter(props) {
  return {
    error: props.error
  };
}

export default class UsersInvite extends React.Component {
  constructor(props) {
    super(props);
    FormStore.create(USERS_INVITE_FORM_GUID);
    this.props = props;
    this.state = stateSetter(props);

    this.validateString = validateString().bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  _onValidForm(errs, values) {
    userActions.createUserInvite(values.email.value);
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
    let content;
    if (this.props.currentUserAccess) {
      content = (
        <div>
          <PanelDocumentation description>
            <p>Organizational Managers can add new users below.</p>
          </PanelDocumentation>
          <Form
            guid={ USERS_INVITE_FORM_GUID }
            classes={ ['users_invite_form'] }
            ref="form"
            onSubmit={ this._onValidForm }
            errorOverride={ this.errorMessage }
          >
            <FormText
              formGuid={ USERS_INVITE_FORM_GUID }
              classes={ ['test-users_invite_name'] }
              label="User's email"
              name="email"
              validator={ this.validateString }
            />
            <Action label="submit" type="submit" disabled={ this.props.inviteDisabled }>Invite new user</Action>
          </Form>
        </div>
      );
    } else {
      content = "";
    }
    return (
      <div className="test-users-invite">
        {content}
      </div>
    );
  }

}

UsersInvite.propTypes = {
  inviteDisabled: React.PropTypes.bool,
  currentUserAccess: React.PropTypes.bool,
  error: React.PropTypes.object
};

UsersInvite.defaultProps = {
  inviteDisabled: false,
  currentUserAccess: false,
  error: {}
};
