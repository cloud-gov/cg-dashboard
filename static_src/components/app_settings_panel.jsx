
import style from 'cloudgov-style';
import React from 'react';

import Panel from './panel.jsx';
import PanelGroup from './panel_group.jsx';
import PanelRow from './panel_row.jsx';
import RouteList from './route_list.jsx';
import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string,
  initialAppGuid: React.PropTypes.string.isRequired
};

const defaultProps = {
  title: 'Default title'
};

export default class AppSettingsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <Panel title="Application settings">
        <RouteList initialAppGuid={ this.props.initialAppGuid } />
      </Panel>
    );
  }
}

AppSettingsPanel.propTypes = propTypes;
AppSettingsPanel.defaultProps = defaultProps;
