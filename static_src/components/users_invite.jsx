
/**
 * Renders a users pages that allows to switch between all users in a space
 * and all users in the org.
 */

import React from 'react';

import { Form, FormText } from './form';
import PanelDocumentation from './panel_documentation.jsx';
import Action from './action.jsx';

import OrgStore from '../stores/org_store';
import FormStore from '../stores/form_store';

import cfApi from '../util/cf_api';
import uaaApi from '../util/uaa_api';
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
    uaaApi.inviteUaaUser(values.email.value).then(function(data){
      let userGuid, orgGuid;
      if (data['new_invites'].length > 0){
        userGuid = data['new_invites'][0]['userId'];
        orgGuid = OrgStore.currentOrgGuid;
        cfApi.postCreateNewUserWithGuid(userGuid).then(function(){
          cfApi.putAssociateUserToOrganization(userGuid, orgGuid);
        });
      }
    });
  }

  render() {
    return (
      <div>
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
