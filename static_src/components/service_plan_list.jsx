
/**
 * Renders a list of service plans
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';
import Reactable from 'reactable';

import Action from './action.jsx';
import serviceActions from '../actions/service_actions.js';
import ServicePlanStore from '../stores/service_plan_store.js';
import createStyler from '../util/create_styler';

function stateSetter(serviceGuid) {
  const servicePlans = ServicePlanStore.getAllFromService(serviceGuid)

  return {
    servicePlans,
    empty: ServicePlanStore.fetched && !servicePlans.length,
  };
}

export default class ServicePlanList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      serviceGuid: props.initialServiceGuid,
      servicePlans: this.props.initialServicePlans
    };
    this._onChange = this._onChange.bind(this);
    this._handleAdd = this._handleAdd.bind(this);
    this.styler = createStyler(style);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ serviceGuid: nextProps.initialServiceGuid });
    this.setState(stateSetter(this.state.serviceGuid));
  }

  _onChange() {
    this.setState(stateSetter(this.state.serviceGuid));
  }

  _handleAdd(planGuid) {
    serviceActions.createInstanceForm(this.state.serviceGuid,
      planGuid);
  }

  get columns() {
    var columns = [
      { label: 'Service Plan Name', key: 'label' },
      { label: 'Free', key: 'free' },
      { label: 'Description', key: 'description' },
      { label: 'Cost', key: 'extra.costs.amount.usd' },
      { label: 'Actions', key: 'actions' }
    ];

    return columns;
  }

  get rows() {
    return this.state.servicePlans;
  }

  render() {
    let content = <div></div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No service plans</h4>;
    } else if (this.rows.length) {
      content = (
      <table>
        <thead>
          <tr>
            { this.columns.map((column) => {
              return (
                <th column={ column.label } className={ column.key }
                  key={ column.key }
                >
                  { column.label }</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          { this.rows.map((plan) => {
            return (
              <tr key={ plan.guid }>
                <td label="Name">
                  <span>{ plan.name }</span>
                </td>
                <td label="Free">{ (plan.free) ? 'Yes': 'No' }</td>
                <td label="Description">{ plan.description }</td>
                <td label="Cost">
                  <span>
                    ${ ServicePlanStore.getCost(plan).toFixed(2) } monthly
                  </span>
                </td>
                <td label="Actions">
                  <Action
                    classes={ ["test-create_service_instance"] }
                    onClickHandler={ this._handleAdd.bind(this, plan.guid) }
                    label="create">
                      <span>Create service instance</span>
                  </Action>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      );
    }

    return (
    <div className={ this.styler('tableWrapper') }>
      { content }
    </div>
    );
  }
}

ServicePlanList.propTypes = {
  initialServiceGuid: React.PropTypes.string,
  initialServicePlans: React.PropTypes.array
};

ServicePlanList.defaultProps = {
  initialServicePlans: []
};
