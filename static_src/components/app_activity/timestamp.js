import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns/esm';

const propTypes = { timestamp: PropTypes.string };

const formatTimestamp = timestamp =>
  format(timestamp, 'MMM DD YYYY HH:mm:ss ZZ');

const Timestamp = ({ timestamp }) => (
  <span className="activity_log-item_timestamp">
    {formatTimestamp(timestamp)}
  </span>
);

Timestamp.propTypes = propTypes;

export default Timestamp;
