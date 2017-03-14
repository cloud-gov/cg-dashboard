
import React from 'react';

import { config } from 'skin';
import PanelActions from './panel_actions.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

export default class InfoLogs extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <PanelActions>
        <p>
          View more logs at <a href={ config.platform.logs.url }>{ config.platform.logs.name }</a>.
        </p>
      </PanelActions>
    );
  }
}

InfoLogs.propTypes = {};
InfoLogs.defaultProps = {};
