/**
 * Renders a form that allows org users to invite new users
 * to cloud.gov
 */

import PropTypes from "prop-types";
import React from "react";
import Action from "./action.jsx";
import FormStore from "../stores/form_store";
import { Form, FormText } from "./form";
import PanelDocumentation from "./panel_documentation.jsx";
import userActions from "../actions/user_actions";
import { validateEmail } from "../util/validators";

const USERS_INVITE_FORM_GUID = "users-invite-form";

const propTypes = {
  inviteDisabled: PropTypes.bool,
  inviteEntityType: PropTypes.string.isRequired,
  currentUserAccess: PropTypes.bool,
  error: PropTypes.object
};
const defaultProps = {
  inviteDisabled: false,
  currentUserAccess: false,
  error: {}
};

function stateSetter(props) {
  return {
    error: props.error
  };
}

export default class UsersInvite extends React.Component {
  constructor(props) {
    super(props);
    FormStore.create(USERS_INVITE_FORM_GUID);

    this.state = stateSetter(props);

    this.validateEmail = validateEmail().bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  _onValidForm(errs, values) {
    let email = "";

    if (values.email) {
      email = values.email.value;
    }

    const isEmailValid = this.validateEmail(email, "email") === null;

    if (isEmailValid) {
      userActions.createUserInvite(email);
    }
  }

  get errorMessage() {
    const { error } = this.props;

    if (!error) return "";

    const message = error.contextualMessage;

    if (error.message) {
      return `${message}: ${error.message}.`;
    }

    return message;
  }

  get invitationMessage() {
    const entity = this.props.inviteEntityType;

    return (
      `Invite a new user to cloud.gov and this ${entity}` +
      ` or add an existing user to this ${entity}.`
    );
  }

  render() {
    const { inviteDisabled } = this.props;

    if (!this.props.currentUserAccess) {
      return null;
    }

    return (
      <div className="test-users-invite">
        <PanelDocumentation description>
          <p>{this.invitationMessage}</p>
        </PanelDocumentation>
        <Form
          guid={USERS_INVITE_FORM_GUID}
          classes={["users_invite_form"]}
          ref="form"
          onSubmit={this._onValidForm}
          errorOverride={this.errorMessage}
        >
          <FormText
            formGuid={USERS_INVITE_FORM_GUID}
            classes={["test-users_invite_name"]}
            label="User's email"
            name="email"
            validator={this.validateEmail}
          />
          <Action label="submit" type="submit" disabled={inviteDisabled}>
            Add user to this {this.props.inviteEntityType}
          </Action>
        </Form>
      </div>
    );
  }
}

UsersInvite.propTypes = propTypes;

UsersInvite.defaultProps = defaultProps;
