/**
 * Renders the form to create a service instance
 */

import React from 'react';

import Box from './box.jsx';
import Button from './button.jsx';
import { Form, FormText, FormSelect, FormElement, FormError } from './form.jsx';
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
      errs: [],
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

  _onValidateForm = (errs) => {
    this.setState({errs: errs});
  }

  get serviceName() {
    return this.props.service.label || 'unknown';
  }

  get servicePlanName() {
    return this.props.servicePlan.name || 'unknown';
  }

  render() {
    var errorMsg;

    if (this.state.errs.length) {
      errorMsg = <FormError message='There were errors submitting the form.' />
    }

    return (
      <Box>
      <h4>Create service instance for { this.serviceName } using { 
          this.servicePlanName } plan.
        </h4>

        <Form action="/service_instances" method="post" ref="form"
            onValidate={ this._onValidateForm }>
          { errorMsg }
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
