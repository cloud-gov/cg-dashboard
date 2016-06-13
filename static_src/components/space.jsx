
import React from 'react';

import AppList from '../components/app_list.jsx';
import OrgStore from '../stores/org_store.js';
import ServiceInstanceList from '../components/service_instance_list.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import Tabnav from './tabnav.jsx';

const PAGES = {
  'apps': AppList,
  'services': ServiceInstanceList,
  'users': Users
}

export default class Space extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      space: {},
      currentOrgGuid: this.props.initialOrgGuid,
      currentSpaceGuid: this.props.initialSpaceGuid,
    };
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
    this.setState({
      currentOrgGuid: OrgStore.currentOrgGuid,
      currentSpaceGuid: this.props.initialSpaceGuid,
      space: SpaceStore.get(this.props.initialSpaceGuid)
    });
  }

  spaceUrl(page) {
    // TODO fix this with a link somehow
    return `/#/org/${this.state.currentOrgGuid}/spaces/${this.state.space.guid}/${page}`;
  }

  get currentContent() {
    return PAGES[this.props.currentPage];
  }

  get subNav() {
    return [
      { name: 'apps', element: <a href={ this.spaceUrl('apps') }>Apps</a> },
      { name: 'services', element: <a href={ this.spaceUrl('services') }>
          Service Instances</a> },
      { name: 'users', element: <a href={ this.spaceUrl('users') }>
          User Management</a> }
    ];
  }

  render() {
    var Content = this.currentContent,
        tabNav;

    if (this.state.space.guid) {
      tabNav = (
        <Tabnav items={ this.subNav } initialItem={ this.props.currentPage } />
      );
    }

    return (
      <div>
        <div>
          <h2>{ this.state.spaceName } Space</h2>
        </div>
        { tabNav }
        <div>
          <div role="tabpanel">
            <Content
              initialOrgGuid={ this.state.currentOrgGuid }
              initialSpaceGuid={ this.state.currentSpaceGuid }
            />
          </div>
        </div>
      </div>
    );
  }
};

Space.propTypes = {
  currentPage: React.PropTypes.string,
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

Space.defaultProps = {
  currentPage: 'apps'
};
