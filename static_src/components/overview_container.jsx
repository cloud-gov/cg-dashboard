
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import { config } from 'skin';
import Icon from './icon.jsx';
import Loading from './loading.jsx';
import OrgQuickLook from './org_quick_look.jsx';
import OrgStore from '../stores/org_store.js';
import PageHeader from './page_header.jsx';
import Panel from './panel.jsx';
import PanelGroup from './panel_group.jsx';
import PanelRow from './panel_row.jsx';
import SpaceStore from '../stores/space_store.js';
import SpaceQuicklook from './space_quicklook.jsx';

function stateSetter() {
  const orgs = OrgStore.getAll() || [];
  const spaces = SpaceStore.getAll() || [];

  return {
    empty: !OrgStore.loading && !SpaceStore.loading && !orgs.length,
    loading: OrgStore.loading || SpaceStore.loading,
    orgs: orgs.sort((a, b) => a.name.localeCompare(b.name)),
    spaces
  };
}

export default class OverviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  orgSpaces(orgGuid) {
    return this.state.spaces.filter((space) => space.organization_guid ===
      orgGuid);
  }

  anyOrgsOpen() {
    return this.state.orgs.reduce((prev, org) => prev || !!org.quicklook_open,
      false);
  }

  render() {
    const state = this.state;
    let loading = <Loading text="Loading orgs" />;
    let content = <div>{ loading }</div>;
    const title = (
      <span>
        <Icon name="home" bordered iconType="fill" iconSize="large" /> Overview
      </span>
    );

    if (state.empty) {
      content = <h4 className="test-none_message">No organizations</h4>;
    } else if (!state.loading && this.state.orgs.length > 0 || this.anyOrgsOpen()) {
      content = (
      <div className={ this.styler('grid') }>
        <PageHeader title={ title } />
        <Panel title="Your organizations">
          { state.orgs.map((org) =>
            <PanelRow key={ org.guid } styleClass="boxed">
              <OrgQuickLook
                org={ org }
                spaces={ this.orgSpaces(org.guid) }
              />
              { org.quicklook_open && this.orgSpaces(org.guid).map((space) =>
                <SpaceQuicklook space={ space } orgGuid={ org.guid }
                  key={ space.guid } loading={ state.loading }
                />
              )}
            </PanelRow>
          )}
        </Panel>
        <Panel title="Cheatsheet">
          { config.home.tiles.map((Tile, i) => {
            let cheatContent;
            if (i % 2 === 0) {
              cheatContent = (
                <div key={ `tile-${i}` }>
                  <PanelGroup columns={ 6 }>
                    <Tile />
                  </PanelGroup>
                </div>
              );
            } else {
              cheatContent = (
                <PanelGroup columns={ 6 } key={ `tile-${i}` }>
                  <Tile />
                </PanelGroup>
              );
            }
            return cheatContent;
          })}
        </Panel>
      </div>
      );
    }

    return content;
  }
}
