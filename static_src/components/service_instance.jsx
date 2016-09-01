
import style from 'cloudgov-style';
import React from 'react';

import panelCss from '../css/panel.css';

import Action from './panel_actions.jsx';
import PanelActions from './panel_actions.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';

import createStyler from '../util/create_styler';

const propTypes = {
  serviceInstance: React.PropTypes.object,
  bound: React.PropTypes.bool
};

const defaultProps = {
  serviceInstance: {},
  bound: false
};

export default class ServiceInstanceListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style, panelCss);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  get instanceState() {
    if (!this.props.bound) return ServiceInstanceStore.OPERATION_STATES.inactive;
    if (!this.props.serviceInstance) return '';
    return ServiceInstanceStore.getInstanceReadableState(
      this.props.serviceInstance);
  }

  render() {
    let content = <div></div>;
    const serviceInstance = this.props.serviceInstance;

    if (serviceInstance) {
      content = (
        <div>
          <h5 className={ this.styler('panel-column') }>
            { serviceInstance.name }
          </h5>
          <span className={ this.styler('panel-column') }>
            { serviceInstance.servicePlan &&
              <span>{ serviceInstance.servicePlan.name }</span>
            }
            <br />
            { serviceInstance.servicePlan &&
              <span>${ ServicePlanStore.getCost(serviceInstance.servicePlan) } monthly</span>
            }
          </span>
          <span className={ this.styler('panel-column', 'panel-column-less') }>
            <span>{ this.instanceState }</span>
          </span>
        </div>
      );
    }

    return content;
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
