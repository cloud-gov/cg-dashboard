/**
 * Renders the marketplace page
 */

import React from 'react';

import CreateServiceInstance from './create_service_instance.jsx';
import ServiceList from './service_list.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceStore from '../stores/service_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import ServicePlanStore from '../stores/service_plan_store.js';

function stateSetter() {
  var services = ServiceStore.getAll(),
      createInstanceForm = ServiceInstanceStore.createInstanceForm;

  services.forEach(function(service) {
    var plan = ServicePlanStore.getAllFromService(service.guid);
    service.servicePlans = plan; 
  });

  return {
    services: services,
    createInstanceForm: ServiceInstanceStore.createInstanceForm 
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentOrgGuid: props.initialOrgGuid,
      services: []
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ServiceStore.addChangeListener(this._onChange);
    ServicePlanStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    var form;

    if (this.state.createInstanceForm) {
      form = (
        <CreateServiceInstance
          service={ this.state.createInstanceForm.service }
          servicePlan={ this.state.createInstanceForm.servicePlan }
        />
      );
    }

    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">Marketplace</h3>
        </div>
        <ServiceList initialServices={ this.state.services } />
        { form }
      </div>
    );
  }
}

Marketplace.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired
}
