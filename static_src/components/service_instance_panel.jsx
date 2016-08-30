
import style from 'cloudgov-style';
import React from 'react';

import AppStore from '../stores/app_store.js';
import Panel from './panel.jsx';
import PanelHeader from './panel_header.jsx';
import PanelGroup from './panel_group.jsx';
import ServiceBindingStore from '../stores/service_binding_store.js';
import ServiceInstanceListPanel from './service_instance_list_panel.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import SpaceStore from '../stores/space_store.js';

import createStyler from '../util/create_styler';

const propTypes = {
};

const defaultProps = {
};

function stateSetter() {
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentAppGuid = AppStore.currentAppGuid;
  const serviceInstances = ServiceInstanceStore.getAllBySpaceGuid(
    currentSpaceGuid);
  const serviceBindings = ServiceBindingStore.getAllByApp(currentAppGuid);
  const boundServiceInstances = serviceInstances.filter((serviceInstance) => {
    return !!serviceBindings.find((serviceBinding) => {
      return serviceInstance.guid === serviceBinding.service_instance_guid;
    });
  });
  const unboundServiceInstances = serviceInstances.filter((serviceInstance) => {
    return boundServices.find((boundService) => {
      return boundService.guid !== serviceInstance.guid;
    });
  });

  return {
    boundServiceInstances,
    unboundServiceInstances
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
  }

  componentWillUnmount() {
    ServiceInstanceStore.removeChangeListener(this._onChange);
    ServiceBindingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    return (
      <Panel title="Services">
        <PanelGroup>
          <PanelHeader>
            <h3>Bound service instances</h3>
          </PanelHeader>
          <ServiceInstanceListPanel
            serviceInstances={ this.state.boundServiceInstances }
            bound
          />
        </PanelGroup>

        <PanelGroup>
          <PanelHeader>
            <h3>Unbound service instances</h3>
          </PanelHeader>
          <ServiceInstanceListPanel
            serviceInstances={ this.state.unboundServiceInstances }
          />
        </PanelGroup>
      </Panel>
    );
  }
}

ServiceInstancePanel.propTypes = propTypes;
ServiceInstancePanel.defaultProps = defaultProps;
