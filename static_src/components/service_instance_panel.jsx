
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import AppStore from '../stores/app_store.js';
import Loading from './loading.jsx';
import Panel from './panel.jsx';
import PanelHeader from './panel_header.jsx';
import PanelGroup from './panel_group.jsx';
import ServiceBindingStore from '../stores/service_binding_store.js';
import ServiceInstanceListPanel from './service_instance_list_panel.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import ServicePlanStore from '../stores/service_plan_store.js';
import SpaceStore from '../stores/space_store.js';

import createStyler from '../util/create_styler';

const propTypes = {
};

const defaultProps = {
};


function boundReady(instances) {
  return ServiceInstanceStore.fetched && ServicePlanStore.fetched &&
      ServiceBindingStore.fetched && !instances.length;
}

function unboundReady(instances) {
  return ServiceInstanceStore.fetched && ServicePlanStore.fetched &&
    !instances.length;
}

function stateSetter() {
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentAppGuid = AppStore.currentAppGuid;
  const serviceInstances = ServiceInstanceStore.getAllBySpaceGuid(currentSpaceGuid)
  .map((serviceInstance) => {
    const servicePlan = ServicePlanStore.get(serviceInstance.service_plan_guid);
    return Object.assign({}, serviceInstance, { servicePlan });
  });
  const serviceBindings = ServiceBindingStore.getAllByApp(currentAppGuid);
  const boundServiceInstances = serviceInstances.map((serviceInstance) => {
    const binding = serviceBindings.find((serviceBinding) =>
      serviceInstance.guid === serviceBinding.service_instance_guid
    );
    if (!binding) return null;
    return Object.assign({}, serviceInstance, { serviceBinding: binding });
  }).filter((instance) => !!instance);

  const unboundServiceInstances = serviceInstances.filter((serviceInstance) => {
    const binding = serviceBindings.find((serviceBinding) =>
      serviceInstance.guid === serviceBinding.service_instance_guid
    );
    if (binding) return null;
    return serviceInstance;
  }).filter((instance) => !!instance);

  const loading = ServiceInstanceStore.fetching ||
    ServicePlanStore.fetching ||
    ServiceBindingStore.fetching;

  return {
    currentAppGuid,
    boundServiceInstances,
    unboundServiceInstances,
    loading
  };
}

export default class ServiceInstancePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ServiceInstanceStore.addChangeListener(this._onChange);
    ServiceBindingStore.addChangeListener(this._onChange);
    ServicePlanStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ServiceInstanceStore.removeChangeListener(this._onChange);
    ServiceBindingStore.removeChangeListener(this._onChange);
    ServicePlanStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let loading = <Loading text="Loading services" />;
    let content = <div>{ loading }</div>;

    if (!this.state.loading) {
      content = [
        <PanelGroup key="1">
          <PanelHeader>
            <h3>Bound service instances</h3>
          </PanelHeader>
          <ServiceInstanceListPanel
            currentAppGuid={ this.state.currentAppGuid }
            serviceInstances={ this.state.boundServiceInstances }
            bound
            empty={ boundReady(this.state.boundServiceInstances) }
          />
        </PanelGroup>,
        <PanelGroup key="2">
          <PanelHeader>
            <h3>Unbound service instances</h3>
          </PanelHeader>
          <ServiceInstanceListPanel
            currentAppGuid={ this.state.currentAppGuid }
            serviceInstances={ this.state.unboundServiceInstances }
            empty={ unboundReady(this.state.unboundServiceInstances) }
          />
        </PanelGroup>
      ];
    }

    return (
      <Panel title="Services">
        { content }
      </Panel>
    );
  }
}

ServiceInstancePanel.propTypes = propTypes;
ServiceInstancePanel.defaultProps = defaultProps;
