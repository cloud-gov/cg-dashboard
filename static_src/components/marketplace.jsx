/**
 * Renders the marketplace page
 */

import React from "react";
import CreateServiceInstance from "./create_service_instance.jsx";
import Loading from "./loading.jsx";
import OrgStore from "../stores/org_store.js";
import PanelDocumentation from "./panel_documentation.jsx";
import ServiceInstanceStore from "../stores/service_instance_store.js";
import ServiceList from "./service_list.jsx";
import ServicePlanStore from "../stores/service_plan_store.js";
import ServiceStore from "../stores/service_store.js";
import { config } from "skin";

const propTypes = {};

function stateSetter() {
  const loading = ServiceStore.loading || ServicePlanStore.loading;
  const currentOrgGuid = OrgStore.currentOrgGuid;

  return {
    currentOrgGuid,
    loading: loading,
    currentOrg: OrgStore.get(currentOrgGuid),
    createInstanceForm: ServiceInstanceStore.createInstanceForm,
    services: ServiceStore.getAll().map(service => {
      const plan = ServicePlanStore.getAllFromService(service.guid);
      return { ...service, servicePlans: plan };
    })
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this.handleChange);
    ServiceStore.addChangeListener(this.handleChange);
    ServicePlanStore.addChangeListener(this.handleChange);
    ServiceInstanceStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this.handleChange);
    ServiceStore.removeChangeListener(this.handleChange);
    ServicePlanStore.removeChangeListener(this.handleChange);
    ServiceInstanceStore.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState(stateSetter());
  }

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          Use this marketplace to create service instances for apps in this
          space. Then bind service instances to apps. See{" "}
          <a href="https://cloud.gov/docs/services/">docs for these services</a>,
          and
          {config.docs.managed_services && (
            <span>
              <a href={config.docs.managed_services}>
                {" "}
                learn about using service instances
              </a>.
            </span>
          )}
        </p>
      </PanelDocumentation>
    );
  }

  render() {
    const state = this.state;
    let form;

    if (state.createInstanceForm) {
      form = (
        <CreateServiceInstance
          error={state.createInstanceForm.error}
          service={state.createInstanceForm.service}
          servicePlan={state.createInstanceForm.servicePlan}
        />
      );
    }

    let content = <Loading text="Loading marketplace services" />;

    if (!state.loading) {
      content = (
        <div>
          {this.documentation}
          <ServiceList services={state.services} />
          {form}
        </div>
      );
    }

    return <div>{content}</div>;
  }
}

Marketplace.propTypes = propTypes;
