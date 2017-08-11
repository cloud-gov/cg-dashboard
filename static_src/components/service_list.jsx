
/**
 * Renders a list of services
 */
import PropTypes from 'prop-types';
import React from 'react';
import ServiceListItem from './service_list_item.jsx';
import ServiceStore from '../stores/service_store.js';

const propTypes = {
  services: PropTypes.array
};

const empty = services => !ServiceStore.loading && !services.length;

let content = null;

const ServiceList = ({ services }) => {
  if (empty(services)) {
    content = <h4 className="test-none_message">No services</h4>;
  } else if (services.length) {
    content = (
      <div>
        { services.map((service) => {
          const { servicePlans, guid, label, description, updated_at } = service;

          return (
            <ServiceListItem
              key={ guid }
              guid={ guid }
              label={ label }
              description={ description }
              updatedAt={ updated_at }
              servicePlans={ servicePlans }
            />
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
