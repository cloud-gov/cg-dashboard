
/**
 * Renders a list of service plans
 */

import React from 'react';
import Reactable from 'reactable';

import Button from './button.jsx';
import serviceActions from '../actions/service_actions.js';
import ServicePlanStore from '../stores/service_plan_store.js';

import createStyler from '../util/create_styler';
import tableStyles from 'cloudgov-style/css/base.css';

function stateSetter(serviceGuid) {
  return {
    servicePlans: ServicePlanStore.getAllFromService(serviceGuid)
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
    this.styler = createStyler(tableStyles);
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
      { label: 'Name', key: 'label' },
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
    var content = <h4 className="test-none_message">No service plans</h4>;

    if (this.rows.length) {
      content = (
      <table>
        <thead>
          { this.columns.map((column) => {
            return (
              <th column={ column.label } className={ column.key }
                key={ column.key }
              >
                { column.label }</th>
            );
          })}
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
                    ${ (plan.extra && plan.extra.costs &&
                        plan.extra.costs[0].amount.usd || 0).toFixed(2) } monthly
                  </span>
                </td>
                <td label="Actions">
                  <Button
                    classes={ ["test-create_service_instance"] }
                    onClickHandler={ this._handleAdd.bind(this, plan.guid) }
                    label="create">
                      <span>Create service instance</span>
                  </Button>
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
