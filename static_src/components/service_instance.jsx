
import PropTypes from 'prop-types';
import React from 'react';
import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import FormError from './form/form_error.jsx';
import Loading from './loading.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import serviceActions from '../actions/service_actions.js';

import { OPERATION_FAILED } from '../stores/service_instance_store.js';

const propTypes = {
  currentAppGuid: PropTypes.string.isRequired,
  serviceInstance: PropTypes.object,
  bound: PropTypes.bool
};

const defaultProps = {
  serviceInstance: {},
  bound: false
};

export default class ServiceInstance extends React.Component {
  constructor(props) {
    super(props);

    this.bindHandler = this.bindHandler.bind(this);
    this.unbindHandler = this.unbindHandler.bind(this);
    this.unbindConfirmedHandler = this.unbindConfirmedHandler.bind(this);
    this.unbindCancelHandler = this.unbindCancelHandler.bind(this);
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
          className="error_message">
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

    return content;
  }

  get confirmation() {
    if (this.props.serviceInstance.changing) {
      const style = { color: '#595959' };
      const message = (
        <div>
          <h3 style={ style }>Unbind { this.props.serviceInstance.name } service?</h3>
          <span>Unbinding a service may break your application.</span>
        </div>
      );
      return (
        <form>
          <ConfirmationBox
            style="over"
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
        <ElasticLineItem align="end">
          <FormError message={ instance.error.description } />
        </ElasticLineItem>
      );
    }
  }

  render() {
    let content = <div></div>;
    const serviceInstance = this.props.serviceInstance;

    if (serviceInstance) {
      const confirmation = this.confirmation;
      const statusClass = (ServiceInstanceStore.getInstanceState(
        this.props.serviceInstance) === OPERATION_FAILED) ? 'form-error' : null;

      if (confirmation) {
        content = (
        <ElasticLineItem>
          { confirmation }
        </ElasticLineItem>
        );
      } else {
        content = (
          <ElasticLine>
            <ElasticLineItem>
              { serviceInstance.servicePlan &&
                <strong>{ serviceInstance.servicePlan.name }</strong>
              }
              { this.instanceState }
              <br />
              <span>
                { serviceInstance.name }
              </span>
            </ElasticLineItem>
            <ElasticLineItem>
              <span>{ this.cost }</span>
            </ElasticLineItem>
            { this.displayError }
            <ElasticLineItem align="end">
              { this.actions }
            </ElasticLineItem>
            { confirmation }
          </ElasticLine>
        );
      }
    }

    return content;
  }
}

ServiceInstance.propTypes = propTypes;
ServiceInstance.defaultProps = defaultProps;
