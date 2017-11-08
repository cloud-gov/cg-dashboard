import React from "react";

import { config } from "skin";
import PanelActions from "./panel_actions.jsx";

export default class InfoLogs extends React.Component {
  render() {
    return (
      <PanelActions>
        <p>
          View more logs at{" "}
          <a href={config.platform.logs.url}>{config.platform.logs.name}</a>.
        </p>
      </PanelActions>
    );
  }
}

InfoLogs.propTypes = {};
InfoLogs.defaultProps = {};
