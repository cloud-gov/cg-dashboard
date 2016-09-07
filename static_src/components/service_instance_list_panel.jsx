
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import PanelRow from './panel_row.jsx';
import ServiceInstance from './service_instance.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  serviceInstances: React.PropTypes.array,
  bound: React.PropTypes.bool,
  empty: React.PropTypes.bool
};

const defaultProps = {
  serviceInstances: [],
  bound: false,
  empty: false
};

export default class ServiceInstanceListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.styler = createStyler(style);
  }

  render() {
    let content = <div></div>;

    if (this.props.empty) {
      content = <div><PanelRow><h4>No services</h4></PanelRow></div>;
    } else {
      content = (
        <div>
        { this.props.serviceInstances.map((serviceInstance) =>
          <PanelRow key={serviceInstance.guid}>
            <ServiceInstance serviceInstance={serviceInstance}
              bound={this.props.bound}
            />
          </PanelRow>
        )}
        </div>
      );
    }

    return content;
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
