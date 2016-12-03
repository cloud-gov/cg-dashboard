
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import Loading from './loading.jsx';
import OrgQuickLook from './org_quick_look.jsx';
import OrgStore from '../stores/org_store.js';
import Panel from './panel.jsx';
import PanelRow from './panel_row.jsx';
import SpaceStore from '../stores/space_store.js';
import SpaceQuicklook from './space_quicklook.jsx';

function stateSetter() {
  const orgs = OrgStore.getAll() || [];
  const spaces = SpaceStore.getAll() || [];

  return {
    empty: !OrgStore.loading && !SpaceStore.loading && !orgs.length,
    loading: OrgStore.loading || SpaceStore.loading,
    orgs,
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
    return this.state.spaces.filter((space) => space.organization_guid === orgGuid);
  }

  render() {
    const state = this.state;
    let loading = <Loading text="Loading orgs" />;
    let content = <div>{ loading }</div>;

    if (state.empty) {
      content = <h4 className="test-none_message">No organizations</h4>;
    } else if (!this.state.loading && this.state.orgs.length > 0) {
      content = (
      <div className={ this.styler('grid') }>
        <h1>Overview</h1>
        <Panel title="Your organizations">
          { state.orgs.map((org) =>
            <PanelRow key={ org.guid } styleClass="boxed">
              <OrgQuickLook
                org={ org }
                spaces={ this.orgSpaces(org.guid) }
              />
              { org.quicklook_open && this.orgSpaces(org.guid).map((space) => {
                return <SpaceQuicklook space={ space } orgGuid={ org.guid }
                  key={ space.guid }
                  />
              })}
            </PanelRow>
          )}
        </Panel>
      </div>
      );
    }

    return content;
  }
}
