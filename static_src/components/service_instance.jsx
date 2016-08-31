
import style from 'cloudgov-style';
import React from 'react';

import Action from './panel_actions.jsx';
import PanelActions from './panel_actions.jsx';
import ServicePlanStore from '../stores/service_plan_store.js';

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
    this.state = {};

    this.styler = createStyler(style);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  get instanceState() {
    return 'Running';
  }

  render() {
    let content = <div></div>;
    const serviceInstance = this.props.serviceInstance;
    console.log('render instance', serviceInstance);
    if (serviceInstance && serviceInstance.servicePlan) {
      console.log('render cost', ServicePlanStore.getCost(serviceInstance.servicePlan));
    }

    if (serviceInstance) {
      content = (
        <div>
          <span>
            { serviceInstance.name }
          </span>
          <span>
            { serviceInstance.servicePlan &&
              <span>{ serviceInstance.servicePlan.name }</span>
            }
            <br />
            { serviceInstance.servicePlan &&
              <span>${ ServicePlanStore.getCost(serviceInstance.servicePlan) } monthly</span>
            }
          </span>
          <PanelActions>
            <span>{ this.instanceState }</span>
            <br />
            <Action type="link">
              Bind
            </Action>
          </PanelActions>
        </div>
      );
    }

    return content;
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
