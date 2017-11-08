import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  item: PropTypes.object,
  visible: PropTypes.bool
};

const RawJSONDetail = ({ item, visible }) => {
  if (!visible) return null;

  return (
    <div className="activity_log-item_raw">
      <div>Raw event log</div>
      <code>
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </code>
    </div>
  );
};

RawJSONDetail.propTypes = propTypes;
export default RawJSONDetail;
