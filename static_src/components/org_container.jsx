
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';


import AppCountStatus from './app_count_status.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import Panel from './panel.jsx';
import ServiceCountStatus from './service_count_status.jsx';
import SpaceCountStatus from './space_count_status.jsx';
import SpaceStore from '../stores/space_store.js';
import SpaceQuicklook from './space_quicklook.jsx';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;

  const org = OrgStore.get(currentOrgGuid);
  const spaces = SpaceStore.getAll()
    .filter((space) => space.organization_guid === currentOrgGuid)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    empty: !OrgStore.loading && !SpaceStore.loading && !org,
    loading: OrgStore.loading || SpaceStore.loading,
    org,
    spaces: spaces || []
  };
}

export default class OrgContainer extends React.Component {
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

  allServices() {
    return this.state.spaces.reduce((all, space) => {
      if (space.services && space.services.length) {
        return all.concat(space.services);
      }
      return all;
    }, []);
  }

  allApps() {
    return this.state.spaces.reduce((all, space) => {
      if (space.apps && space.apps.length) {
        return all.concat(space.apps);
      }
      return all;
    }, []);
  }

  render() {
    const state = this.state;
    let loading = <Loading text="Loading org" />;
    let content = <div>{ loading }</div>;

    if (state.empty) {
      content = <h4 className="test-none_message">No organizations</h4>;
    } else if (!state.loading && state.org) {
      const allApps = this.allApps();
      const allServices = this.allServices();

      // TODO repeated pattern space_container, overview
      content = (
      <div className={ this.styler('grid') }>
        <div className={ this.styler('grid') }>
          <div className={ this.styler('grid-width-6') }>
            <h2>Organization overview</h2>
          </div>
          <div className={ this.styler('grid-width-6') }>
            <SpaceCountStatus spaces={ state.spaces } />
            <AppCountStatus apps={ allApps } appCount={ allApps && allApps.length } />
            <ServiceCountStatus services={ allServices }
              serviceCount={ allServices && allServices.length }
            />
          </div>
        </div>

        <Panel title="">
          { state.spaces.map((space) => (
            <SpaceQuicklook
              key={ space.guid }
              space={ space }
              orgGuid={ state.org.guid }
              showAppDetail
            />
            )
          )}
        </Panel>
      </div>
      );
    }

    return content;
  }
}
