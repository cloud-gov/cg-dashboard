
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import Loading from './loading.jsx';
import PanelActions from './panel_actions.jsx';
import PanelRowError from './panel_row_error.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';

import { OPERATION_FAILED } from '../stores/service_instance_store.js';

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
    const appBinding = ServiceInstanceStore.getServiceBindingForApp(
      this.props.currentAppGuid,
      this.props.serviceInstance);
    serviceActions.unbindService(appBinding);
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
    let content;
    if (!this.props.serviceInstance) return content;

    const instanceState = ServiceInstanceStore.getInstanceState(
      this.props.serviceInstance);

    if (instanceState === OPERATION_FAILED) {
      content = (
        <span style={{ marginLeft: '0.5rem', display: 'inline' }}
          className={ this.styler('error_message') }>
          { ServiceInstanceStore.getInstanceReadableState(
            this.props.serviceInstance) }
        </span>
      );
    }

    return content;
  }

  get cost() {
    if (!this.props.serviceInstance.servicePlan) return '';
    const cost = ServicePlanStore.getCost(this.props.serviceInstance.servicePlan);
    if (cost === 0) return 'Free';
    return `$${cost.toFixed(2)} monthly`;
  }

  get actions() {
    let content;

    if (this.props.serviceInstance.loading) {
      content = (
        <Loading
          text={ this.props.serviceInstance.loading }
          loadingDelayMS={ 100 }
          style="inline"
        />
      );
    } else if (this.props.bound) {
      content = (
        <Action
          clickHandler={ this.unbindHandler }
          label="Unbind"
          style="warning"
          type="link"
        >
          Unbind
        </Action>
      );
    } else {
      content = (
        <Action
          clickHandler={ this.bindHandler }
          label="Bind"
          type="outline"
        >
          Bind
        </Action>
      );
    }

    return <PanelActions>{ content }</PanelActions>;
  }

  get confirmation() {
    if (this.props.serviceInstance.changing) {
      const style = { color: '#595959' };
      const message = (
        <div>
          <h3 style={ style }>Unbind { this.props.serviceInstance.name } service?</h3>
          <p>Unbinding a service may break your application.</p>
        </div>
      );
      return (
        <form>
          <ConfirmationBox
            style="block"
            message={ message }
            confirmationText="Yes, unbind"
            confirmHandler={ this.unbindConfirmedHandler }
            cancelHandler={ this.unbindCancelHandler }
          />
        </form>
      );
    }
    return null;
  }

  get displayError() {
    const instance = this.props.serviceInstance;
    if (instance.error) {
      return (
        <PanelRowError message={instance.error.description} />
      );
    }
  }

  render() {
    let content = <div></div>;
    const serviceInstance = this.props.serviceInstance;

    if (serviceInstance) {
      const confirmation = this.confirmation;
      const statusClass = (ServiceInstanceStore.getInstanceState(
        this.props.serviceInstance) === OPERATION_FAILED) ? 'panel-column-error' : null;

      content = (
        <div style={{ flexWrap: 'wrap' }}>
          <span className={ this.styler('panel-column', statusClass) }>
            { serviceInstance.servicePlan &&
              <strong>{ serviceInstance.servicePlan.name }</strong>
            }
            { this.instanceState }
            <br />
            <span>
              { serviceInstance.name }
            </span>
          </span>
          <span className={ this.styler('panel-column', 'panel-column-less',
            'panel-column-last') }>
            <span>{ this.cost }</span>
          </span>
          { this.displayError }
          <span className={ this.styler('panel-column', 'panel-column-less',
            'panel-column-last') }>
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
