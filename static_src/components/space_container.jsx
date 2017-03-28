
import React from 'react';

import AppCountStatus from './app_count_status.jsx';
import AppList from '../components/app_list.jsx';
import Breadcrumbs from './breadcrumbs.jsx';
import EntityIcon from './entity_icon.jsx';
import InfoAppCreate from './info_app_create.jsx';
import Loading from './loading.jsx';
import Marketplace from './marketplace.jsx';
import OrgStore from '../stores/org_store.js';
import PageHeader from './page_header.jsx';
import Panel from './panel.jsx';
import ServiceCountStatus from './service_count_status.jsx';
import ServiceInstanceTable from './service_instance_table.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import UserStore from '../stores/user_store';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter() {
  return {
    space: SpaceStore.currentSpace() || {},
    currentOrg: OrgStore.currentOrg(),
    currentOrgGuid: OrgStore.currentOrgGuid,
    currentSpaceGuid: SpaceStore.currentSpaceGuid,
    currentUser: UserStore.currentUser,
    loading: SpaceStore.loading || OrgStore.loading || UserStore.isLoadingCurrentUser
  };
}

export default class SpaceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  get currentOrgName() {
    return this.state.currentOrg ? this.state.currentOrg.name : '';
  }

  get currentOrgGuid() {
    return this.state.currentOrg || '0';
  }

  render() {
    // TODO add back in service instance lists
    if (this.state.loading) {
      return <Loading />;
    }

    let main = <div></div>;
    const title = (
      <span>
        <EntityIcon entity="space" iconSize="large" /> { this.state.space.name }
      </span>
    );

    if (this.state.space && this.state.space.guid) {
      const space = this.state.space;
      main = (
      <div>
        <div className={ this.styler('grid') }>
          <div className={ this.styler('grid-width-12') }>
            <Breadcrumbs />
            <PageHeader title={ title } />
          </div>
        </div>
        <Panel title="">

          <div className={ this.styler('grid', 'panel-overview-header') }>
            <div className={ this.styler('grid-width-8') }>
              <h1 className={ this.styler('panel-title') }>Space overview</h1>
            </div>
            <div className={ this.styler('grid-width-4') }>
              <div className={ this.styler('count_status_container') }>
                <AppCountStatus apps={ space.apps } appCount={ space.apps && space.apps.length } />
                <ServiceCountStatus services={ space.services }
                  serviceCount={ space.services && space.services.length }
                />
              </div>
            </div>
          </div>

          <AppList />
          <InfoAppCreate
            space={ space }
            org={ this.state.currentOrg }
            user={ this.state.currentUser }
          />
        </Panel>
        <Panel title="Service instances">
          <ServiceInstanceTable />
        </Panel>
        <Panel title="Marketplace">
          <Marketplace />
        </Panel>
        <Panel title="Space users">
          <Users />
        </Panel>
      </div>
      );
    }

    return main;
  }
}

SpaceContainer.propTypes = {
  currentPage: React.PropTypes.string
};

SpaceContainer.defaultProps = {
  currentPage: 'apps'
};
