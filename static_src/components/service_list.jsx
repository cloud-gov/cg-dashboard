
/**
 * Renders a list of services
 */
import PropTypes from 'prop-types';
import React from 'react';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import ServiceStore from '../stores/service_store.js';
import ServicePlanList from './service_plan_list.jsx';
import formatDateTime from '../util/format_date.js';

const propTypes = {
  services: PropTypes.array
};

const empty = services => !ServiceStore.loading && !services.length;

const ServiceList = ({ services }) => {
  const { services } = this.props;

  let content = <div></div>;

  if (empty(services)) {
    content = <h4 className="test-none_message">No services</h4>;
  } else if (services.length) {
    content = (
      <div>
        { services.map((service) => {
          const { servicePlans, guid, label, description, updated_at } = service;

          return (
            <div className="panel-section" key={ guid }>
              <ElasticLine>
                <ElasticLineItem>
                  <h3 className="sans-s6">
                    <strong>{ label }</strong>
                  </h3>
                  <span>{ description }</span>
                </ElasticLineItem>
                <ElasticLineItem align="end">
                  Updated { formatDateTime(updated_at) }
                </ElasticLineItem>
              </ElasticLine>
              <ServicePlanList plans={ servicePlans } serviceGuid={ guid } />
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
};

ServiceList.propTypes = propTypes;
ServiceList.defaultProps = {};

export default ServiceList;
