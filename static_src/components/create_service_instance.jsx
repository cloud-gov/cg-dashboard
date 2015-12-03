/**
 * Renders the form to create a service instance
 */

import React from 'react';

import Box from './box.jsx';
import Button from './button.jsx';
import { Form, FormText, FormSelect, FormElement } from './form.jsx';
import SpaceStore from '../stores/space_store.js';
import serviceActions from '../actions/service_actions.js';
import serviceInstanceStore from '../stores/service_instance_store.js';

function stateSetter() {
  var spaces = SpaceStore.getAll();

  return {
    spaces: spaces
  }
}

export default class CreateServiceInstance extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      spaces: []
    };
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  _onChange = () => {
    this.setState(stateSetter());
  }

  _submit = (ev) => {
    ev.preventDefault();
    this.refs.form.validate();
  }

  _onValidateField = (fieldName, err) => {
    console.error('there were errors', fieldName, err);
  }

  get serviceName() {
    return this.props.service.label || 'unknown';
  }

  get servicePlanName() {
    return this.props.servicePlan.name || 'unknown';
  }

  render() {
    return (
      <Box>
      <h4>Create service instance for { this.serviceName } using { 
          this.servicePlanName } plan.
        </h4>

        <Form action="/service_instances" method="post" ref="form">
          <FormText 
            label="Choose a name for the service" 
            name="name"
            validator={ FormElement.validatorString }
            onValidate={ this._onValidate.bind(this, 'name') }
          />
          <FormSelect 
            label="Select the space for the service instance"
            name="space"
            options={ this.state.spaces.map((space) => {
              return { value: space.guid, label: space.name };
            })}
            validator={ FormElement.validatorString }
            onValidate={ this._onValidateField.bind(this, 'space') }
          />
          <Button onClickHandler={ this._submit }>Create service instance
          </Button>
        </Form>
      </Box>
    );
  }
};

CreateServiceInstance.propTypes = {
  service: React.PropTypes.object,
  servicePlan: React.PropTypes.object.isRequired
};

CreateServiceInstance.defaultProps = {
  service: {}
}
