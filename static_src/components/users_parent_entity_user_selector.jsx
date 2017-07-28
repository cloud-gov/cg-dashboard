/**
 * Renders a form that allows org users to invite new users
 * to cloud.gov
 */

import PropTypes from 'prop-types';
import React from 'react';
import Action from './action.jsx';
import FormStore from '../stores/form_store';
import { Form, FormSelect } from './form';
import PanelDocumentation from './panel_documentation.jsx';
import userActions from '../actions/user_actions';
import { validateString } from '../util/validators';

const USERS_PARENT_ENTITY_USER_FORM_GUID = 'users-parent-entity-users-form';

const propTypes = {
  orgUsersSelectorDisabled: PropTypes.bool,
  currentUserAccess: PropTypes.bool,
  parentEntityUsers: PropTypes.array,
  error: PropTypes.object,
  parentEntityGuid: PropTypes.string,
  parentEntity: PropTypes.string,
  currentEntityGuid: PropTypes.string,
  currentEntity: PropTypes.string
};
const defaultProps = {
  orgUsersSelectorDisabled: false,
  currentUserAccess: false,
  error: {}
};


function stateSetter(props) {
  return {
    orgUsersSelectorDisabled: props.orgUsersSelectorDisabled,
    currentUserAccess: props.currentUserAccess,
    parentEntityUsers: props.parentEntityUsers,
    parentEntityGuid: props.parentEntityGuid,
    parentEntity: props.parentEntity,
    currentEntityGuid: props.currentEntityGuid,
    currentEntity: props.currentEntity,
    error: props.error
  };
}

export default class OrgUsersSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter(props);

    this.validateString = validateString().bind(this);
    this._onSubmitForm = this._onSubmitForm.bind(this);
  }

  componentDidMount() {
    FormStore.create(USERS_PARENT_ENTITY_USER_FORM_GUID);
  }

  _onSubmitForm(errs, values) {
    const entityType = this.state.currentEntity;
    const entityGuid = this.state.currentEntityGuid;
    const apiKey = 'auditors';
    const roles = 'space_auditor';
    if (values.userGuid) {
      const userGuid = values.userGuid.value;
      userActions.addUserRoles(roles, apiKey, userGuid, entityGuid, entityType);
    }
  }

  get errorMessage() {
    const { error } = this.props;

    if (!error) return '';

    const message = error.contextualMessage;

    if (error.message) {
      return `${message}: ${error.message}.`;
    }

    return message;
  }

  get invitationMessage() {
    const parentEntity = this.props.parentEntity;
    const currentEntity = this.props.currentEntity;

    return `Invite an existing user in this ${parentEntity}` +
      ` to this ${currentEntity}.`;
  }

  get userSelector() {
    const orgUsers = this.state.parentEntityUsers.map((user) =>
      ({ value: user.guid, label: user.username })
    );

    if (!orgUsers) {
      return null;
    }

    return (
      <FormSelect
        formGuid={ USERS_PARENT_ENTITY_USER_FORM_GUID }
        classes={ ['test-users_parent_entity_user_name'] }
        label="Username"
        name="userGuid"
        options={ orgUsers }
        validator={ this.validateString }
      />
    );
  }

  render() {
    const { orgUsersSelectorDisabled } = this.props;

    if (!this.props.currentUserAccess) {
      return null;
    }

    return (
      <div className="test-users-invite">
        <PanelDocumentation description>
          <p>{ this.invitationMessage }</p>
        </PanelDocumentation>
        <Form
          guid={ USERS_PARENT_ENTITY_USER_FORM_GUID }
          classes={ ['users_parent_entity_user_form'] }
          ref="form"
          onSubmit={ this._onSubmitForm }
          errorOverride={ this.errorMessage }
        >
          { this.userSelector }
          <Action
            label="submit"
            type="submit"
            disabled={ orgUsersSelectorDisabled }
          >
            Add user to this { this.state.currentEntity }
          </Action>
        </Form>
      </div>
    );
  }

}

OrgUsersSelector.propTypes = propTypes;

OrgUsersSelector.defaultProps = defaultProps;
