/**
 * Renders the form to create a service instance
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Box from './box.jsx';
import Button from './button.jsx';
import { Form, FormText, FormSelect, FormElement, FormError } from './form.jsx';
import SpaceStore from '../stores/space_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';
import modalStyle from 'cloudgov-style/css/components/modal.css';
import baseStyle from 'cloudgov-style/css/base.css';
import createStyler from '../util/create_styler';


function stateSetter() {
  return {
    createError: ServiceInstanceStore.createError,
    spaces: SpaceStore.getAll()
  };
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
    this.styler = createStyler(modalStyle, baseStyle);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
    this.scrollIntoView();
  }

  scrollIntoView() {
    ReactDOM.findDOMNode(this).scrollIntoView(true);
  }

  _onChange() {
    this.setState(stateSetter());
    this.scrollIntoView();
  }

  _onValidateForm(errs) {
    this.setState({ errs });
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
    let createError;

    if (this.state.createError) {
      createError = <FormError message={ this.state.createError.description } />
    }

    return (
      <div className = { this.styler('modal') }>
        <h4>Create service instance for <strong className = { this.styler('inline-block') }>{ this.serviceName }</strong> using <strong className = { this.styler('inline-block') }>{ this.servicePlanName }</strong> plan.
        </h4>
        { createError }
        <Form action="/service_instances"
            classes={ ["test-create_service_instance_form"] }
            method="post"
            ref="form"
            onValidate={ this._onValidateForm }
            onValid={ this._onValidForm }>
          <FormText
            classes={ ["test-create_service_instance_name"] }
            label="Choose a name for the service"
            name="name"
            validator={ FormElement.validatorString }
          />
          <FormSelect
            classes={ ["test-create_service_instance_space"] }
            label="Choose a name for the service"
            label="Select the space for the service instance"
            name="space"
            options={ this.state.spaces.map((space) => {
              return { value: space.guid, label: space.name };
            })}
            validator={ FormElement.validatorString }
          />
          <Button name="submit">Create service instance</Button>
          <Button name="cancel" classes={ [this.styler("button-cancel")] }>Cancel</Button>
        </Form>
      </div>
    );
  }
}

CreateServiceInstance.propTypes = {
  service: React.PropTypes.object,
  servicePlan: React.PropTypes.object.isRequired
};

CreateServiceInstance.defaultProps = {
  service: {}
};
