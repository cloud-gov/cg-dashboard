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

function stateSetter(orgGuid) {
  const loading = OrgStore.fetching || ServiceStore.fetching
                  || ServiceInstanceStore.fetching || ServicePlanStore.fetching;
  const services = ServiceStore.getAll().map((service) => {
    const plan = ServicePlanStore.getAllFromService(service.guid);
    return { ...service, servicePlans: plan };
  });

  return {
    loading,
    services,
    currentOrg: OrgStore.get(orgGuid),
    createInstanceForm: ServiceInstanceStore.createInstanceForm
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter(this.props.initialOrgGuid);

    this._onChange = this._onChange.bind(this);
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
    this.setState(stateSetter(this.props.initialOrgGuid));
  }

  render() {
    let form;
    const state = this.state;
    let marketplace = <h2>Marketplace</h2>;
    let content = <ServiceList initialServices={ state.services } />;

    if (state.loading) {
      content = <Loading text="Loading marketplace services" />;
    }

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

    return (
      <div>
        <div>
          { marketplace }
        </div>
        { content }
        { form }
      </div>
    );
  }
}

Marketplace.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired
};
