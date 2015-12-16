/**
 * Renders the form to create a service instance
 */

import React from 'react';

import Box from './box.jsx';
import Button from './button.jsx';
import { Form, FormText, FormSelect, FormElement, FormError } from './form.jsx';
import SpaceStore from '../stores/space_store.js';
import ServiceInstanceStore  from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';
import serviceInstanceStore from '../stores/service_instance_store.js';

function stateSetter() {
  var spaces = SpaceStore.getAll(),
      createError = ServiceInstanceStore.createError;

  return {
    createError: createError,
    spaces: spaces
  }
}

export default class CreateServiceInstance extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      errs: [],
      spaces: []
    };
    this._onChange = this._onChange.bind(this);
    this._onValidateForm = this._onValidateForm.bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
    serviceInstanceStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _onValidateForm(errs) {
    this.setState({errs: errs});
  }

  _onValidForm(values) {
    serviceActions.createInstance(
      values.name,
      values.space,
      this.props.servicePlan.guid
    ); 
  }

  get serviceName() {
    return this.props.service.label || 'Unknown Service Name';
  }

  get servicePlanName() {
    return this.props.servicePlan.name || 'Unknown Service Plan Name';
  }

  render() {
    var createError;

    if (this.state.createError) {
      createError = <FormError message={ this.state.createError.description } />
    }

    return (
      <Box>
        <h4>Create service instance for { this.serviceName } using { 
          this.servicePlanName } plan.
        </h4>
        { createError }
        <Form action="/service_instances" method="post" ref="form"
            onValidate={ this._onValidateForm } onValid={ this._onValidForm }>
          <FormText 
            label="Choose a name for the service" 
            name="name"
            validator={ FormElement.validatorString }
          />
          <FormSelect 
            label="Select the space for the service instance"
            name="space"
            options={ this.state.spaces.map((space) => {
              return { value: space.guid, label: space.name };
            })}
            validator={ FormElement.validatorString }
          />
          <Button name="submit">Create service instance</Button>
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
