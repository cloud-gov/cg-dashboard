
import React from 'react';

import AppList from '../components/app_list.jsx';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import Tabnav from './tabnav.jsx';

export default class Space extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      space: {},
      currentOrgGuid: this.props.initialOrgGuid,
      currentSpaceGuid: this.props.initialSpaceGuid,
    };
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      currentOrgGuid: OrgStore.currentOrgGuid,
      space: SpaceStore.get(this.state.currentSpaceGuid)
    });
  }

  spaceUrl = (page) => {
    // TODO fix this with a link somehow
    return  `/#/org/${ this.state.currentOrgGuid }/spaces/${ this.state.space.guid}/${page}`;
  }

  get subNav() {
    return [
      { name: 'Apps', element: <a href={ this.spaceUrl('apps') }>Apps</a> },
      { name: 'Service Instances', element: <a href={ this.spaceUrl('services') }>
          Service Instances</a> },
      { name: 'User Management', element: <a href={ this.spaceUrl('users') }>
          User Management</a> }
    ];
  }

  render() {

    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">{ this.state.spaceName } Space</h3>
        </div>
        <Tabnav items={ this.subNav } initialItem="Apps"  />
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active">
            <AppList 
              initialApps={ this.state.space.apps } 
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
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

Space.defaultProps = {
};
