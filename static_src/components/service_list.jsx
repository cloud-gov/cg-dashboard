
/**
 * Renders a list of services
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import ComplexList from './complex_list.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import PanelGroup from './panel_group.jsx';
import ServiceStore from '../stores/service_store.js';
import ServicePlanList from './service_plan_list.jsx';
import createStyler from '../util/create_styler';
import formatDateTime from '../util/format_date.js';

function stateSetter() {
  const services = ServiceStore.getAll();

  return {
    empty: !ServiceStore.loading && !services.length,
    services
  }
}


export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.styler = createStyler(style);
  }

  componentDidMount() {
    ServiceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ServiceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
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

            // TODO use new panel section component
            return (
              <div className={ this.styler('panel-section') } key={ service.guid }>
                <ElasticLine>
                  <ElasticLineItem>
                    <h3 className={ this.styler('sans-s6') }>
                      <strong>{ service.label }</strong>
                    </h3>
                    <span>{ service.description }</span>
                  </ElasticLineItem>
                  <ElasticLineItem align="end">
                    Updated { formatDateTime(service.updated_at) }
                  </ElasticLineItem>
                </ElasticLine>
                { servicePlans }
              </div>
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

ServiceList.propTypes = {};

ServiceList.defaultProps = {};
