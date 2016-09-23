
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import PanelActions from './panel_actions.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';

import createStyler from '../util/create_styler';

const propTypes = {
  currentAppGuid: React.PropTypes.string.isRequired,
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

    this.bindHandler = this.bindHandler.bind(this);
    this.unbindHandler = this.unbindHandler.bind(this);
    this.unbindConfirmedHandler = this.unbindConfirmedHandler.bind(this);
    this.unbindCancelHandler = this.unbindCancelHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  unbindConfirmedHandler(ev) {
    ev.preventDefault();
    serviceActions.unbindService(this.props.serviceInstance.serviceBinding);
  }

  unbindCancelHandler(ev) {
    ev.preventDefault();
    serviceActions.changeServiceInstanceCancel(this.props.serviceInstance.guid);
  }

  unbindHandler(ev) {
    ev.preventDefault();
    serviceActions.changeServiceInstanceCheck(this.props.serviceInstance.guid);
  }

  bindHandler(ev) {
    ev.preventDefault();
    serviceActions.bindService(this.props.currentAppGuid,
      this.props.serviceInstance.guid);
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

  get actions() {
    let content;

    if (this.props.bound) {
      content = (
        <Action
          clickHandler={ this.unbindHandler }
          label="Unbind"
          type="link">
          Unbind
        </Action>
      );
    } else {
      content = (
        <Action
          clickHandler={ this.bindHandler }
          label="Bind"
          type="link">
          Bind
        </Action>
      );
    }

    return content;
  }

  get confirmation() {
    if (this.props.serviceInstance.changing) {
      const style = { color: '#595959' };
      const message = (
        <div>
          <h3 style={ style }>Are you sure you want to
            unbind { this.props.serviceInstance.name }?</h3>
          <p>Unbinding a service may break your application.</p>
        </div>
      );
      return (
        <form>
          <ConfirmationBox
            style="block"
            message={ message }
            confirmationText="Unbind"
            confirmHandler={ this.unbindConfirmedHandler }
            cancelHandler={ this.unbindCancelHandler }
          />
        </form>
      );
    }
    return null;
  }

  render() {
    let content = <div></div>;
    const serviceInstance = this.props.serviceInstance;

    if (serviceInstance) {
      const confirmation = this.confirmation;

      content = (
        <div style={{ flexWrap: 'wrap' }}>
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
          <span className={ this.styler('panel-column', 'panel-column-less',
            'panel-column-last') }>
            <span>{ this.instanceState }</span>
            <br />
            { this.actions }
          </span>
          { confirmation }
        </div>
      );
    }

    return content;
  }
}

ServiceInstance.propTypes = propTypes;
ServiceInstance.defaultProps = defaultProps;
