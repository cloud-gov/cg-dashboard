import React from 'react';
import PropTypes from 'prop-types';
import Action from './action.jsx';

const propTypes = {
  cost: PropTypes.string,
  onAddInstance: PropTypes.func,
  plan: PropTypes.shape({
    guid: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  })
};

class ServicePlan extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { plan, onAddInstance } = this.props;

    onAddInstance(plan.guid);
  }

  render() {
    const { cost, plan } = this.props;

    return (
      <tr>
        <td label="Name">{ plan.name }</td>
        <td label="Description">{ plan.description }</td>
        <td label="Cost">{ cost }</td>
        <td label="Actions">
          <Action
            classes={ ['test-create_service_instance'] }
            clickHandler={ this.handleClick }
            label="create"
          >
            Create service instance
          </Action>
        </td>
      </tr>
    );
  }
}

ServicePlan.propTypes = propTypes;

export default ServicePlan;
