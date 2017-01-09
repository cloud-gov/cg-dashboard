
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';


import AppCountStatus from './app_count_status.jsx';
import Breadcrumbs from './breadcrumbs.jsx';

import Col from './col.jsx';
import EntityIcon from './entity_icon.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import PageHeader from './page_header.jsx';
import Panel from './panel.jsx';
import Row from './row.jsx';
import ServiceCountStatus from './service_count_status.jsx';
import SpaceCountStatus from './space_count_status.jsx';
import SpaceStore from '../stores/space_store.js';
import ContentsTreeSpace from './contents_tree_space.jsx';
import Users from './users.jsx';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;

  const org = OrgStore.get(currentOrgGuid);
  const spaces = SpaceStore.getAll()
    .filter((space) => space.organization_guid === currentOrgGuid)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    empty: !OrgStore.loading && !SpaceStore.loading && !org,
    loading: OrgStore.loading || SpaceStore.loading,
    org: org || {},
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
    let loading = <Loading text="Loading organization" />;
    let content = <div>{ loading }</div>;
    const title = (
      <span>
        <EntityIcon entity="org" iconSize="large" /> { state.org.name }
      </span>
    );

    if (state.empty) {
      content = (
        <div className={ this.styler('panel-content') }>
          <h4 className="test-none_message">No organizations</h4>
        </div>
      );
    } else if (!state.loading && state.org) {
      const allApps = this.allApps();
      const allServices = this.allServices();

      // TODO repeated pattern space_container, overview
      content = (
      <div className={ this.styler('grid') }>
        <div className={ this.styler('grid') }>
          <div className={ this.styler('grid-width-12') }>
            <Breadcrumbs />
            <PageHeader title={ title } />
          </div>
        </div>
        <Panel>
          <div className={ this.styler('panel-overview-header') }>
            <Row valign="top">
              <Col flex={ 1 }>
                <h1 className={ this.styler('panel-title') }>Organization overview</h1>
              </Col>
              <Col flex={ 1 }>
                <div className={ this.styler('count_status_container') } >
                  <SpaceCountStatus spaces={ state.spaces } />
                  <AppCountStatus apps={ allApps } appCount={ allApps && allApps.length } />
                  <ServiceCountStatus services={ allServices }
                    serviceCount={ allServices && allServices.length }
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className={ this.styler('panel-content') }>
            <div className={ this.styler('contents-tree') }>
              { state.spaces.map((space) => (
                <ContentsTreeSpace
                  key={ space.guid }
                  space={ space }
                  orgGuid={ state.org.guid }
                  showAppDetail
                />
                )
              )}
            </div>
          </div>
        </Panel>

        <Panel title="Organization users">
          <Users />
        </Panel>
      </div>
      );
    }

    return content;
  }
}
