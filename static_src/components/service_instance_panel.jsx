
import style from 'cloudgov-style';
import React from 'react';

import Panel from './panel.jsx';
import PanelHeader from './panel_header.jsx';
import PanelGroup from './panel_group.jsx';
import ServiceInstanceListPanel from './service_instance_list_panel.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
};

const defaultProps = {
};

function stateSetter() {
  return {};
}

export default class ServiceInstancePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
          <ServiceInstanceListPanel bound />
        </PanelGroup>

        <PanelGroup>
          <PanelHeader>
            <h3>Unbound service instances</h3>
          </PanelHeader>
          <ServiceInstanceListPanel />
        </PanelGroup>
      </Panel>
    );
  }
}

ServiceInstancePanel.propTypes = propTypes;
ServiceInstancePanel.defaultProps = defaultProps;
