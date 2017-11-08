import React from 'react';

import Panel from 'dashboard/components/panel.jsx';
import PanelGroup from 'dashboard/components/panel_group.jsx';
import InfoActivities from './info_activities.jsx';
import InfoEnvironments from './info_environments.jsx';
import InfoSandbox from './info_sandbox.jsx';
import InfoStructure from './info_structure.jsx';

export const panels = [
  () => (
    <Panel title="Cheatsheet">
      {[
        InfoActivities,
        InfoStructure,
        InfoSandbox,
        InfoEnvironments
      ].map((Tile, i) => {
        if (i % 2 === 0) {
          return (
            <div key={`tile-${i}`}>
              <PanelGroup columns={6}>
                <Tile />
              </PanelGroup>
            </div>
          );
        }
        return (
          <PanelGroup columns={6} key={`tile-${i}`}>
            <Tile />
          </PanelGroup>
        );
      })}
    </Panel>
  )
];
