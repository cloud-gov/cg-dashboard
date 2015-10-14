
import React from 'react';

import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import Tabnav from './tabnav.jsx';

export default class Space extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { space: {}, spaceGuid: this.props.initialSpaceGuid };
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      currentOrgGuid: OrgStore.currentOrgGuid,
      space: SpaceStore.get(this.state.spaceGuid)
    });
  }

  spaceUrl = (page) => {
    // TODO fix this with a link somehow
    return  `/#/org/${ this.state.currentOrgGuid }/spaces/${ this.state.space.guid}/${page}`;
  }

  render() {
    var subNav = [
      { name: 'Apps', element: <a href={ this.spaceUrl('apps') }>Apps</a> },
      { name: 'Service Instances', element: <a href={ this.spaceUrl('services') }>
          Service Instances</a> },
      { name: 'User Management', element: <a href={ this.spaceUrl('users') }>
          User Management</a> }
    ];

    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">{ this.state.spaceName } Space</h3>
        </div>
        <Tabnav items={ subNav } initialItem="Apps"  />
      </div>
    );
  }
};

Space.propTypes = {
  initialSpaceGuid: React.PropTypes.string.isRequired
};

Space.defaultProps = {
};
