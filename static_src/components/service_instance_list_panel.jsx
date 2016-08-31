
import style from 'cloudgov-style';
import React from 'react';

import PanelRow from './panel_row.jsx';
import ServiceInstance from './service_instance.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  serviceInstances: React.PropTypes.array,
  bound: React.PropTypes.bool
};

const defaultProps = {
  serviceInstances: [],
  bound: false
};

export default class ServiceInstanceListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

    this.styler = createStyler(style);
  }

  render() {

    return (
      <div>
      { this.props.serviceInstances.map((serviceInstance) => {
        return (
          <PanelRow key={serviceInstance.guid}>
            <ServiceInstance serviceInstance={serviceInstance}
              bound={this.props.bound}
            />
          </PanelRow>
        );
      })}
      </div>
    );
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
