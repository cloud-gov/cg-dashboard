
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import OrgStore from '../stores/org_store.js';
import Panel from './panel.jsx';
import PanelGroup from './panel_group.jsx';
import PanelRow from './panel_row.jsx';
import SpaceStore from '../stores/space_store.js';

function stateSetter() {
  const orgs = OrgStore.getAll();
  const spaces = SpaceStore.getAll();

  return {
    orgs,
    spaces
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    const state = this.state;

    return (
    <div className={ this.styler('grid') }>
      <h1>Overview</h1>
      <Panel title="Your organizations">
        { state.orgs.map((org) =>
          <PanelRow>

          </PanelRow>
        )}
      </Panel>
    </div>
    );
  }
}
