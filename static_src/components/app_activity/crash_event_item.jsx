import React from "react";
import PropTypes from "prop-types";

const crashReason = (status, description) => {
  switch (description) {
    case "app instance exited":
      return `the app instance exited with ${status} status`;
    case "out of memory":
      return "it ran out of memory";
    case "failed to accept connections within health check timeout":
    case "failed to start":
      return `it ${description}`;
    default:
      return "of an unknown reason";
  }
};

const propTypes = {
  exitDescription: PropTypes.string,
  exitStatus: PropTypes.string
};

const CrashEventItem = ({ exitStatus, exitDescription }) => (
  <span>
    The app crashed because {crashReason(exitStatus, exitDescription)}.
  </span>
);

CrashEventItem.propTypes = propTypes;
export default CrashEventItem;
