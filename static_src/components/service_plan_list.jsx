/**
 * Renders a list of service plans
 */
import PropTypes from "prop-types";
import React from "react";
import ServicePlan from "./service_plan.jsx";
import serviceActions from "../actions/service_actions.js";
import ServicePlanStore from "../stores/service_plan_store.js";

const propTypes = {
  plans: PropTypes.array,
  serviceGuid: PropTypes.string
};

const empty = plans => !ServicePlanStore.loading && !plans.length;

const sortPlansByCost = plans =>
  plans.sort((a, b) => {
    const costA = ServicePlanStore.getCost(a);
    const costB = ServicePlanStore.getCost(b);
    if (costA === costB) {
      return a.name.localeCompare(b.name);
    } else {
      return costA - costB;
    }
  });

export default class ServicePlanList extends React.Component {
  constructor(props) {
    super(props);

    this._handleAdd = this._handleAdd.bind(this);
  }

  _handleAdd(planGuid) {
    serviceActions.createInstanceForm(this.props.serviceGuid, planGuid);
  }

  get columns() {
    const columns = [
      { label: "Service Plan Name", key: "label" },
      { label: "Description", key: "description" },
      { label: "Actions", key: "actions" }
    ];

    return columns;
  }

  cost(plan) {
    const cost = ServicePlanStore.getCost(plan);
    if (plan.free || cost === 0) return "Free";
    return `$${cost.toFixed(2)} monthly`;
  }

  render() {
    const plans = sortPlansByCost(this.props.plans);
    let content = <div />;

    if (empty(plans)) {
      content = <h4 className="test-none_message">No service plans</h4>;
    } else if (plans.length) {
      content = (
        <table>
          <thead>
            <tr>
              {this.columns.map(column => {
                return (
                  <th className={column.key} key={column.key}>
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => {
              return (
                <ServicePlan
                  cost={this.cost(plan)}
                  key={index}
                  onAddInstance={this._handleAdd}
                  plan={plan}
                />
              );
            })}
          </tbody>
        </table>
      );
    }

    return <div className="tableWrapper">{content}</div>;
  }
}

ServicePlanList.propTypes = propTypes;

ServicePlanList.defaultProps = {};
