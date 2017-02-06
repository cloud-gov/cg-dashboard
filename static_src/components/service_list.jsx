
/**
 * Renders a list of services
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import PanelGroup from './panel_group.jsx';
import PanelRow from './panel_row.jsx';
import ServiceStore from '../stores/service_store.js';
import ServicePlanList from './service_plan_list.jsx';
import createStyler from '../util/create_styler';
import formatDateTime from '../util/format_date.js';

function stateSetter(props) {
  const services = props.initialServices;

  return {
    empty: !ServiceStore.loading && !services.length,
    services
  }
}


export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this.styler = createStyler(style);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateSetter(nextProps));
  }

  render() {
    let content = <div></div>;

    if (this.state.empty) {
      let content = <h4 className="test-none_message">No services</h4>;
    } else if (this.state.services.length) {
      const state = this.state;
      content = (
        <div>
          { state.services.map((service) => {
            let servicePlans;

            if (service.servicePlans.length) {
              servicePlans = (
                <ServicePlanList initialServiceGuid={ service.guid }
                  initialServicePlans={ service.servicePlans }
                />
              );
            }

            return (
              <PanelGroup key={ service.guid }>
                <div>
                  <span className={ this.styler('panel-column') }>
                    <h3 className={ this.styler('sans-s6') }>
                      <strong>{ service.label }</strong>
                    </h3>
                    <span>{ service.description }</span>
                  </span>
                  <span>
                    Updated { formatDateTime(service.updated_at) }
                  </span>
                </div>
                { servicePlans }
              </PanelGroup>
            );
          })}
        </div>
      );
    }

    return (
    <div>
      { content }
    </div>
    );
  }
}

ServiceList.propTypes = {
  initialServices: React.PropTypes.array
};

ServiceList.defaultProps = {
  initialServices: []
};
