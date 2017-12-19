/**
 * Renders the form to create a service instance
 */
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import Action from "./action.jsx";
import { Form, FormText, FormSelect, FormElement, FormError } from "./form";
import FormStore from "../stores/form_store";
import Loading from "./loading.jsx";
import OrgStore from "../stores/org_store.js";
import SpaceStore from "../stores/space_store.js";
import ServiceInstanceStore from "../stores/service_instance_store.js";
import serviceActions from "../actions/service_actions.js";
import formActions from "../actions/form_actions";
import { validateString } from "../util/validators";

const CREATE_SERVICE_INSTANCE_FORM_GUID = "create-service-form";

// Note:
// This is a temporary hardcoded solution to resolve the need
// for multiple parameters when setting up service instances.
const CF_CLI_SERVICE_DETAILS = {
  "cdn-route": "https://cloud.gov/docs/services/cdn-route/",
  "cloud-gov-identity-provider":
    "https://cloud.gov/docs/services/cloud-gov-identity-provider/",
  "cloud-gov-service-account":
    "https://cloud.gov/docs/services/cloud-gov-service-account/"
};

const propTypes = {
  error: PropTypes.object,
  service: PropTypes.object,
  servicePlan: PropTypes.object.isRequired
};

const defaultProps = {
  service: {}
};

function stateSetter() {
  return {
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
      spaces: SpaceStore.getAll()
    };

    this.validateString = validateString().bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._onCancelForm = this._onCancelForm.bind(this);
  }

  componentDidMount() {
    FormStore.create(CREATE_SERVICE_INSTANCE_FORM_GUID);
    SpaceStore.addChangeListener(this.handleChange);
    ServiceInstanceStore.addChangeListener(this.handleChange);
    this.scrollIntoView();
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this.handleChange);
    ServiceInstanceStore.removeChangeListener(this.handleChange);
  }

  scrollIntoView() {
    ReactDOM.findDOMNode(this).scrollIntoView(true);
  }

  handleChange() {
    this.setState(stateSetter());
    this.scrollIntoView();
  }

  handleSubmit(errs, values) {
    this.setState({ errs }, () => {
      const { name, space } = values;
      const instanceName = (name && name.value) || null;
      const spaceName = (space && space.value) || null;

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

  get formContent() {
    const serviceName = this.serviceName;
    if (CF_CLI_SERVICE_DETAILS.hasOwnProperty(serviceName)) {
      return (
        <Form
          guid={CREATE_SERVICE_INSTANCE_FORM_GUID}
          classes={["test-create_service_instance_form"]}
          onSubmit={this.handleSubmit}
        >
          <legend>
            The
            <strong className="actions-callout-inline-block">
              {serviceName}
            </strong>{" "}
            service instance must be created using the CF CLI. Please refer to{" "}
            <a href={CF_CLI_SERVICE_DETAILS[serviceName]} target="_blank">
              {CF_CLI_SERVICE_DETAILS[serviceName]}
            </a>{" "}
            for more information.
          </legend>
        </Form>
      );
    } else {
      return (
        <Form
          guid={CREATE_SERVICE_INSTANCE_FORM_GUID}
          classes={["test-create_service_instance_form"]}
          onSubmit={this.handleSubmit}
        >
          <legend>
            Create a service instance for
            <strong className="actions-callout-inline-block">
              {this.serviceName}
            </strong>{" "}
            using
            <strong className="actions-callout-inline-block">
              {this.servicePlanName}
            </strong>{" "}
            plan.
          </legend>
          <FormText
            formGuid={CREATE_SERVICE_INSTANCE_FORM_GUID}
            classes={["test-create_service_instance_name"]}
            label="Choose a name for the service instance"
            name="name"
            validator={this.validateString}
          />
          <FormSelect
            formGuid={CREATE_SERVICE_INSTANCE_FORM_GUID}
            classes={["test-create_service_instance_space"]}
            label="Select the space for the service instance"
            name="space"
            options={this.validSpaceTargets}
            validator={this.validateString}
          />
          {this.contextualAction}
          <Action
            label="cancel"
            style="base"
            type="outline"
            clickHandler={this._onCancelForm}
          >
            Cancel
          </Action>
        </Form>
      );
    }
  }

  get serviceName() {
    return this.props.service.label || "Unknown Service Name";
  }

  get servicePlanName() {
    return this.props.servicePlan.name || "Unknown Service Plan Name";
  }

  get validSpaceTargets() {
    const currentOrgGuid = OrgStore.currentOrgGuid;
    const { spaces } = this.state;

    return spaces
      .filter(space => {
        return space.org === currentOrgGuid;
      })
      .map(space => {
        return { value: space.guid, label: space.name };
      });
  }

  get contextualAction() {
    const { createLoading, createdTempNotification } = this.state;

    let createAction = (
      <Action label="submit" type="submit">
        Create service instance
      </Action>
    );

    if (createLoading) {
      createAction = <Loading style="inline" />;
    } else if (createdTempNotification) {
      createAction = (
        <span className="status status-ok">
          Created! To bind the service instance to an app, go to an application
          page and use the services panel.
        </span>
      );
    }

    return createAction;
  }

  render() {
    let createError;

    if (this.props.error) {
      createError = <FormError message={this.props.error.description} />;
    }

    return (
      <div className="actions-large">
        {createError}
        {this.formContent}
      </div>
    );
  }
}

CreateServiceInstance.propTypes = propTypes;
CreateServiceInstance.defaultProps = defaultProps;
