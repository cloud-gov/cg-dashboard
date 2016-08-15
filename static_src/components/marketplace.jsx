/**
 * Renders the marketplace page
 */

import React from 'react';

import CreateServiceInstance from './create_service_instance.jsx';
import Loading from './loading.jsx';
import ServiceList from './service_list.jsx';

import OrgStore from '../stores/org_store.js';
import ServiceStore from '../stores/service_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import ServicePlanStore from '../stores/service_plan_store.js';

const LOADING_TIME = 400;

function stateSetter(showLoading=false) {
  const loading = ServiceStore.fetching;
  const services = ServiceStore.getAll().map((service) => {
    const plan = ServicePlanStore.getAllFromService(service.guid);
    return { ...service, servicePlans: plan };
  });
  const currentOrgGuid = OrgStore.currentOrgGuid;

  return {
    services,
    currentOrgGuid,
    loading: showLoading && loading,
    currentOrg: OrgStore.get(currentOrgGuid),
    createInstanceForm: ServiceInstanceStore.createInstanceForm
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    window.setTimeout(() => {
      this.showLoader();
    }, LOADING_TIME);
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

  showLoader() {
    this.setState(stateSetter(true));
  }

  render() {
    const state = this.state;
    let form;
    let marketplace = <h2>Marketplace</h2>;
    let list = <ServiceList initialServices={ state.services } />;

    if (state.createInstanceForm) {
      form = (
        <CreateServiceInstance
          service={ state.createInstanceForm.service }
          servicePlan={ state.createInstanceForm.servicePlan }
        />
      );
    }

    if (state.currentOrg) {
      marketplace = <h2>Marketplace for your <strong>{state.currentOrg.name}</strong> organization</h2>;
    }

    let loading = <Loading text="Loading marketplace services" />;
    let content = <div>{ loading }</div>;
    if (!this.state.loading) {
      content = (
        <div>
          <div>
            { marketplace }
            <p><em>Use this marketplace to create service instances for spaces in this org. Then bind service instances to apps using the command line. <a href="https://docs.cloud.gov/apps/managed-services/">Learn about using service instances and marketplaces</a>.</em></p>
          </div>
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
