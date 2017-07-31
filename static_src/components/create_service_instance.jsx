/**
 * Renders the form to create a service instance
 */
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Action from './action.jsx';
import { Form, FormText, FormSelect, FormElement, FormError } from './form';
import FormStore from '../stores/form_store';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';
import { validateString } from '../util/validators';

const CREATE_SERVICE_INSTANCE_FORM_GUID = 'create-service-form';

const propTypes = {
  service: PropTypes.object,
  servicePlan: PropTypes.object.isRequired
};

const defaultProps = {
  service: {}
};

function stateSetter() {
  return {
    createError: ServiceInstanceStore.createError,
    createLoading: ServiceInstanceStore.createLoading,
    createdTempNotification: ServiceInstanceStore.createdTempNotification,
    spaces: SpaceStore.getAll()
  };
}

export default class CreateServiceInstance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [],
      spaces: SpaceStore.getAll(),
      createError: ServiceInstanceStore.createError
    };

    this.validateString = validateString().bind(this);
    this._onChange = this._onChange.bind(this);
    this._onValidForm = this._onValidForm.bind(this);
    this._onCancelForm = this._onCancelForm.bind(this);
  }

  componentDidMount() {
    FormStore.create(CREATE_SERVICE_INSTANCE_FORM_GUID);
    SpaceStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
    this.scrollIntoView();
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  scrollIntoView() {
    ReactDOM.findDOMNode(this).scrollIntoView(true);
  }

  _onChange() {
    this.setState(stateSetter());
    this.scrollIntoView();
  }

  _onValidForm(errs, values) {
    this.setState({ errs }, () => {
      const { name, space } = values;
      const instanceName = name || null;
      const spaceName = space || null;

      serviceActions.createInstance(
        instanceName,
        spaceName,
        this.props.servicePlan.guid
      );
    });
  }

  _onCancelForm(ev) {
    ev.preventDefault();
    serviceActions.createInstanceFormCancel();
  }

  get serviceName() {
    return this.props.service.label || 'Unknown Service Name';
  }

  get servicePlanName() {
    return this.props.servicePlan.name || 'Unknown Service Plan Name';
  }

  get validSpaceTargets() {
    const currentOrgGuid = OrgStore.currentOrgGuid;
    const { spaces } = this.state;

    return spaces.filter(space => {
      return space.org === currentOrgGuid;
    }).map(space => {
      return { value: space.guid, label: space.name }
    });
  }

  render() {
    let createError;
    let createAction = (
      <Action label="submit" type="submit">Create service instance</Action>
    );

    if (this.state.createError) {
      createError = <FormError message={ this.state.createError.description } />
    }

    if (this.state.createLoading) {
      createAction = <Loading style="inline" />;
    } else if (this.state.createdTempNotification) {
      createAction = (
        <span className="status status-ok">
          Created! To bind the service instance to an app, go to an application page and use the services panel.
        </span>
      );
    }

    return (
      <div className="actions-large">
        { createError }
        <Form
          guid={ CREATE_SERVICE_INSTANCE_FORM_GUID }
          classes={ ['test-create_service_instance_form'] }
          ref="form"
          onSubmit={ this._onValidForm }
        >
          <legend>
            Create a service instance for
            <strong className="actions-callout-inline-block">
              { this.serviceName }
            </strong> using
            <strong className="actions-callout-inline-block">
              { this.servicePlanName }
            </strong> plan.
          </legend>
          <FormText
            formGuid={ CREATE_SERVICE_INSTANCE_FORM_GUID }
            classes={ ['test-create_service_instance_name'] }
            label="Choose a name for the service instance"
            name="name"
            validator={ this.validateString }
          />
          <FormSelect
            formGuid={ CREATE_SERVICE_INSTANCE_FORM_GUID }
            classes={ ['test-create_service_instance_space'] }
            label="Select the space for the service instance"
            name="space"
            options={ this.validSpaceTargets }
            validator={ this.validateString }
          />
          { createAction }
          <Action
            label="cancel"
            style="base"
            type="outline"
            clickHandler={ this._onCancelForm }
          >
            Cancel
          </Action>
        </Form>
      </div>
    );
  }
}

CreateServiceInstance.propTypes = propTypes;

CreateServiceInstance.defaultProps = defaultProps;
