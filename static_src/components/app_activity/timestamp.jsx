import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const propTypes = { timestamp: PropTypes.string.isRequired };
const formatTimestamp = timestamp =>
  moment(timestamp)
    .tz(moment.tz.guess())
    .format("MMM DD YYYY HH:mm:ss z");

const Timestamp = ({ timestamp }) => (
  <span className="activity_log-item_timestamp">
    {formatTimestamp(timestamp)}
  </span>
);

Timestamp.propTypes = propTypes;

export default Timestamp;
