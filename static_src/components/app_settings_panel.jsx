
import style from 'cloudgov-style';
import React from 'react';

import Panel from './panel.jsx';
import PanelRow from './panel_row.jsx';
import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string
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
      <Panel title="Settings">
        <PanelRow title="Routes">
          Things can go here and should just work.
          <input type="text"></input>
        </PanelRow>
        <PanelRow title="Framework">
          Ruby
        </PanelRow>
        <PanelRow title="Buildpacks">
          <select>
            <options>buildpacks/ruby</options>
            <options>buildpacks/python</options>
          </select>
        </PanelRow>
        <PanelRow title="Scale">
          <input type="range" min="1" max="6"></input>
        </PanelRow>
      </Panel>
    );
  }
}

AppSettingsPanel.propTypes = propTypes;
AppSettingsPanel.defaultProps = defaultProps;
