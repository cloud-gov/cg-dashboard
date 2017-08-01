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

const AUDITOR_NAME = 'auditors';
const SPACE_AUDITOR_NAME = 'space_auditor';
const USERS_PARENT_ENTITY_USER_FORM_GUID = 'users-parent-entity-users-form';

const propTypes = {
  orgUsersSelectorDisabled: PropTypes.bool,
  currentUserAccess: PropTypes.bool,
  parentEntityUsers: PropTypes.array,
  error: PropTypes.object,
  parentEntity: PropTypes.string,
  currentEntityGuid: PropTypes.string,
  currentEntity: PropTypes.string
};
const defaultProps = {
  orgUsersSelectorDisabled: false,
  currentUserAccess: false,
  error: {}
};

export default class UsersSelector extends React.Component {
  constructor(props) {
    super(props);

    this.validateString = validateString().bind(this);
    this._onSubmitForm = this._onSubmitForm.bind(this);
  }

  componentDidMount() {
    FormStore.create(USERS_PARENT_ENTITY_USER_FORM_GUID);
  }

  _onSubmitForm(errs, values) {
    const { currentEntity } = this.props;
    const { currentEntityGuid } = this.props;
    const user_role = AUDITOR_NAME;
    const resource_role_name = SPACE_AUDITOR_NAME;
    if (values.userGuid) {
      const userGuid = values.userGuid.value;
      userActions.addUserRoles(resource_role_name, user_role, userGuid, currentEntityGuid, currentEntity);
    }
  }

  get invitationMessage() {
    const { parentEntity } = this.props;
    const { currentEntity } = this.props;

    return `Invite an existing user in this ${parentEntity}` +
      ` to this ${currentEntity}.`;
  }

  get userSelector() {
    const { parentEntityUsers } = this.props;
    const orgUsers = parentEntityUsers.map((user) =>
      ({ value: user.guid, label: user.username })
    );

    if (!orgUsers) {
      return null;
    }

    return (
      <FormSelect
        formGuid={ USERS_PARENT_ENTITY_USER_FORM_GUID }
        classes={ ['test-users'] }
        label="Username"
        name="userGuid"
        options={ orgUsers }
        validator={ this.validateString }
      />
    );
  }

  render() {
    const { orgUsersSelectorDisabled } = this.props;
    const { currentEntity } = this.props;

    if (!this.props.currentUserAccess) {
      return null;
    }

    return (
      <div className="test-users-selector">
        <PanelDocumentation description>
          <p>{ this.invitationMessage }</p>
        </PanelDocumentation>
        <Form
          guid={ USERS_PARENT_ENTITY_USER_FORM_GUID }
          classes={ ['org_user_selector'] }
          ref="form"
          onSubmit={ this._onSubmitForm }
        >
          { this.userSelector }
          <Action
            label="submit"
            type="submit"
            disabled={ orgUsersSelectorDisabled }
          >
            Add user to this { currentEntity }
          </Action>
        </Form>
      </div>
    );
  }

}

UsersSelector.propTypes = propTypes;

UsersSelector.defaultProps = defaultProps;
