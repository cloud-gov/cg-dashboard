import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

const InfoActivities = ({ className }) => (
  <section className={className}>
    <h4>A few things you can do here</h4>
    <ul>
      <li>See recent log events for your apps.</li>
      <li>Create and bind service instances for your apps.</li>
      <li>Create and bind routes for your apps.</li>
      <li>Change memory allocation and number of instances for your apps.</li>
      <li>Restart your apps.</li>
      <li>Manage permissions for users of your orgs and spaces.</li>
    </ul>
  </section>
);

InfoActivities.propTypes = propTypes;

InfoActivities.defaultProps = defaultProps;

export default InfoActivities;
