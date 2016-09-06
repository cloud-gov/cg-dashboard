
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

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

export default class ServiceInstance extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
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

  get cost() {
    if (!this.props.serviceInstance.servicePlan) return '';
    const cost = ServicePlanStore.getCost(this.props.serviceInstance.servicePlan);
    if (cost === 0) return 'Free';
    return `$${cost.toFixed(2)} monthly`;
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
            <span>{ this.cost }</span>
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

ServiceInstance.propTypes = propTypes;
ServiceInstance.defaultProps = defaultProps;
