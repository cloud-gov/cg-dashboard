
import React from 'react';

import PanelDocumentation from './panel_documentation.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

export default class InfoLogs extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('panel-actions') }>
        <p>
          View more logs at <a href="https://logs.cloud.gov">logs.cloud.gov</a> (for East/West environment) or <a href="https://logs.fr.cloud.gov">logs.fr.cloud.gov</a> (for GovCloud environment).
        </p>
      </div>
    );
  }
}

InfoLogs.propTypes = {};
InfoLogs.defaultProps = {};
