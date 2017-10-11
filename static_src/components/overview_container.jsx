
import React from 'react';

import { config, homePage } from 'skin';
import EntityEmpty from './entity_empty.jsx';
import Icon from './icon.jsx';
import Loading from './loading.jsx';
import OrgQuicklook from './org_quicklook.jsx';
import OrgStore from '../stores/org_store.js';
import PageHeader from './page_header.jsx';
import PageStore from '../stores/page_store.js';
import Panel from './panel.jsx';
import SpaceStore from '../stores/space_store.js';

function stateSetter() {
  const orgs = OrgStore.getAll() || [];
  const spaces = SpaceStore.getAll() || [];

  return {
    empty: !PageStore.loading && !orgs.length,
    loading: PageStore.loading,
    orgs: orgs.sort((a, b) => a.name.localeCompare(b.name)),
    spaces
  };
}

export default class OverviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    PageStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    PageStore.removeChangeListener(this._onChange);
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
    return this.state.orgs.reduce((prev, org) => prev || !!(org.quicklook && org.quicklook.open),
      false);
  }

  get emptyState() {
    const contactMsg = config.docs.contact && (
      <span>
        <br />
        If this isn’t the case, <a href={ config.docs.contact }>contact us</a>.
      </span>
    );

    return (
      <EntityEmpty callout="We can’t find any of your organizations.">
        <p>
          If you just joined, your organization may not yet be ready. Sometimes
          organizations can take up to 5 minutes to appear on your first login.
          { contactMsg }
        </p>
      </EntityEmpty>
    );
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
      content = this.emptyState;
    } else if (!state.loading && this.state.orgs.length > 0 || this.anyOrgsOpen()) {
      content = (
        <div>
        { state.orgs.map((org) =>
          <div key={ org.guid } className="test-panel-row-organizations">
            <OrgQuicklook
              org={ org }
              spaces={ this.orgSpaces(org.guid) }
            />
          </div>
        )}
        </div>
      );
    }

    const { panels = [] } = homePage;

    return (
      <div className="grid">
        <PageHeader title={ title } />
        <Panel title="Your organizations">
          { content }
        </Panel>
        {panels.map((render, i) => <div key={i}>{render()}</div>)}
      </div>
    );
  }
}
