import React from "react";
import PropTypes from "prop-types";
import Action from "./action.jsx";

const propTypes = {
  cost: PropTypes.string,
  onAddInstance: PropTypes.func,
  plan: PropTypes.shape({
    guid: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  })
};

// This should be removed when solution is setup
// for service instance multiple params (e.g. cdn-route) or services
// that only return information via the cf cli (e.g. space-deployer).
const CF_CLI_SERVICE_PLAN_LIST = [
  "cdn-route",
  "space-auditor",
  "space-deployer",
  "oauth-client"
];

class ServicePlan extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { plan, onAddInstance } = this.props;

    onAddInstance(plan.guid);
  }

  get buttonText() {
    let text;
    const { plan } = this.props;

    if (CF_CLI_SERVICE_PLAN_LIST.indexOf(plan.name) === -1) {
      text = "Create service instance";
    } else {
      text = "Display documentation link";
    }
    return text;
  }

  render() {
    const { plan } = this.props;

    return (
      <tr>
        <td label="Name">{plan.name}</td>
        <td label="Description">{plan.description}</td>
        <td label="Actions">
          <Action
            classes={["test-create_service_instance"]}
            clickHandler={this.handleClick}
            label="create"
          >
            {this.buttonText}
          </Action>
        </td>
      </tr>
    );
  }
}

ServicePlan.propTypes = propTypes;

export default ServicePlan;
