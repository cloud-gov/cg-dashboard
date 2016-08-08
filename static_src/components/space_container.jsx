
import React from 'react';

import AppList from '../components/app_list.jsx';
import OrgStore from '../stores/org_store.js';
import ServiceInstanceList from '../components/service_instance_list.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import Tabnav from './tabnav.jsx';
import TabnavItem from './tabnav_item.jsx';

const PAGES = {
  'apps': AppList,
  'services': ServiceInstanceList,
  'users': Users
}

function stateSetter() {
  return {
    space: SpaceStore.currentSpace(),
    currentOrg: OrgStore.currentOrg(),
    currentOrgGuid: OrgStore.currentOrgGuid,
    currentSpaceGuid: SpaceStore.currentSpaceGuid
  };
}

export default class SpaceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.spaceUrl = this.spaceUrl.bind(this);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  spaceUrl(page) {
    // TODO fix this with a link somehow
    return `/#/org/${this.state.currentOrg.guid}/spaces/${this.state.space.guid}/${page}`;
  }

  get currentContent() {
    return PAGES[this.props.currentPage];
  }

  get subNav() {
    return [
      { name: 'apps',
        element: <TabnavItem controls="apps" href={this.spaceUrl('apps')}
          content="Apps" />
      },
      { name: 'services',
        element: <TabnavItem controls="services" href={this.spaceUrl('services')}
          content="Service Instances" />
      },
      { name: 'users',
        element: <TabnavItem controls="users" href={this.spaceUrl('users')}
          content="User Management" />
      }
    ];
  }

  get currentOrgName() {
    return this.state.currentOrg ? this.state.currentOrg.name : '';
  }

  get currentOrgGuid() {
    return this.state.currentOrg ? this.props.initialOrgGuid : '0';
  }

  render() {
    let Content = this.currentContent;
    let tabNav = <div></div>;
    let main = <div></div>;

    if (this.state.space && this.state.space.guid) {
      if (this.state.currentOrg) {
        tabNav = (
          <Tabnav items={ this.subNav } initialItem={ this.props.currentPage } />
        );
      }
      main = (
      <div>
        <div>
          <h2>
            <strong>{this.state.space.name}</strong> space in your <strong>{ this.currentOrgName }</strong> organization
          </h2>
          <p><em>
            Each <a href="https://docs.cloud.gov/getting-started/concepts/">space</a> provides an environment for related applications (<a href="https://docs.cloud.gov/intro/overview/using-cloudgov-paas/">example use</a>).
          </em></p>
        </div>
        { tabNav }
        <div>
          <div role="tabpanel" id={ this.props.currentPage }>
            <Content
              initialOrgGuid={ this.currentOrgGuid }
              initialSpaceGuid={ this.state.space.guid }
              intitialApps={ this.state.space.apps || [] }
            />
          </div>
        </div>
      </div>
      );
    }

    return (
      <div>
        { main }
      </div>
    );
  }
};

SpaceContainer.propTypes = {
  currentPage: React.PropTypes.string
};

SpaceContainer.defaultProps = {
  currentPage: 'apps'
};
