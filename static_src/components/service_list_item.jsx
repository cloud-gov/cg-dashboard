import PropTypes from 'prop-types';
import React from 'react';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import ServicePlanList from './service_plan_list.jsx';
import formatDateTime from '../util/format_date.js';

const propTypes = {
  guid: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  updatedAt: PropTypes.string,
  servicePlans: PropTypes.array
};

const ServiceListItem = ({ guid, label, description, updatedAt, servicePlans }) =>
  <div className="panel-section">
    <ElasticLine>
      <ElasticLineItem>
        <h3 className="sans-s6">
          <strong>{ label }</strong>
        </h3>
        <span>{ description }</span>
      </ElasticLineItem>
      <ElasticLineItem align="end">
        Updated { formatDateTime(updatedAt) }
      </ElasticLineItem>
    </ElasticLine>
    <ServicePlanList plans={ servicePlans } serviceGuid={ guid } />
  </div>;

ServiceListItem.propTypes = propTypes;

export default ServiceListItem;
