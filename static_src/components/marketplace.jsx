/**
 * Renders the marketplace page
 */

import React from 'react';

import CreateServiceInstance from './create_service_instance.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import PanelDocumentation from './panel_documentation.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import ServiceList from './service_list.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';
import ServiceStore from '../stores/service_store.js';
import createStyler from '../util/create_styler';
import { config } from 'skin';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter() {
  const loading = ServiceStore.loading || ServicePlanStore.loading;
  const services = ServiceStore.getAll().map((service) => {
    const plan = ServicePlanStore.getAllFromService(service.guid);
    return { ...service, servicePlans: plan };
  });
  const currentOrgGuid = OrgStore.currentOrgGuid;

  return {
    services,
    currentOrgGuid,
    loading: loading,
    currentOrg: OrgStore.get(currentOrgGuid),
    createInstanceForm: ServiceInstanceStore.createInstanceForm
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    ServiceStore.addChangeListener(this._onChange);
    ServicePlanStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    ServiceStore.removeChangeListener(this._onChange);
    ServicePlanStore.removeChangeListener(this._onChange);
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          Use this marketplace to create service instances for apps in this space. Then bind service instances to apps.
          { config.docs.managed_services &&
            <span>
              <a href={ config.docs.managed_services }> Learn about using service instances</a>.
            </span>
          }
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
          service={ state.createInstanceForm.service }
          servicePlan={ state.createInstanceForm.servicePlan }
        />
      );
    }

    let loading = <Loading text="Loading marketplace services" />;
    let content = <div>{ loading }</div>;
    if (!this.state.loading) {
      let list = <ServiceList />;
      content = (
        <div>
          { this.documentation }
          { list }
          { form }
        </div>
      );
    }

    return (
      <div>
        { content }
      </div>
    );
  }
}

Marketplace.propTypes = { };
