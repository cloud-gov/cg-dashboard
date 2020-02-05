/**
 * Renders a form that allows org users to invite new users
 * to cloud.gov
 */

import PropTypes from "prop-types";
import React from "react";
import FormStore from "../stores/form_store";
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(errs, values) {
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
      <PanelDocumentation description>
        <p>
          NOTE: Use{" "}
          <a href="https://dashboard-beta.fr.cloud.gov/">the new dashboard</a>{" "}
          to add a new or existing user to this {entity}, as we deprecate this
          dashboard. See our{" "}
          <a href="https://cloud.gov/docs/orgs-spaces/roles/">
            updated documentation on how to manage user access and roles here
          </a>.
        </p>
      </PanelDocumentation>
    );
  }

  render() {
    if (!this.props.currentUserAccess) {
      return null;
    }

    return <div className="test-users-invite">{this.invitationMessage}</div>;
  }
}

UsersInvite.propTypes = propTypes;

UsersInvite.defaultProps = defaultProps;
