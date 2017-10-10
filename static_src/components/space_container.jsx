import PropTypes from 'prop-types';
import React from 'react';

import AppCountStatus from './app_count_status.jsx';
import AppList from '../components/app_list.jsx';
import Breadcrumbs from './breadcrumbs';
import EntityIcon from './entity_icon.jsx';
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

const propTypes = {
  currentPage: PropTypes.string
};

const defaultProps = {
  currentPage: 'apps'
};

export default class SpaceContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
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

    const { currentOrg: org, space } = this.state;

    let main = <div></div>;
    const title = (
      <span>
        <EntityIcon entity="space" iconSize="large" /> { space.name }
      </span>
    );

    if (space && space.guid) {
      main = (
      <div>
        <div className="grid">
          <div className="grid-width-12">
            <Breadcrumbs org={org} space={space} />
            <PageHeader title={ title } />
          </div>
        </div>
        <Panel title="">
          <div className="grid panel-overview-header">
            <div className="grid-width-8">
              <h1 className="panel-title">Space overview</h1>
            </div>
            <div className="grid-width-4">
              <div className="count_status_container">
                <AppCountStatus apps={ space.apps } appCount={ space.apps && space.apps.length } />
                <ServiceCountStatus services={ space.services }
                  serviceCount={ space.services && space.services.length }
                />
              </div>
            </div>
          </div>

          <AppList />
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

SpaceContainer.propTypes = propTypes;

SpaceContainer.defaultProps = defaultProps;
