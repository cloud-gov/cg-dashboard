
import React from 'react';

import AppList from '../components/app_list.jsx';
import OrgStore from '../stores/org_store.js';
import ServiceInstanceList from '../components/service_instance_list.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import Tabnav from './tabnav.jsx';
import TabnavItem from './tabnav_item.jsx';
import { config } from 'skin';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';


const PAGES = {
  'apps': AppList,
  'services': ServiceInstanceList,
  'users': Users
}

const USER_PAGES = {
  'space': 'space_users',
  'org': 'org_users'
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
    this.styler = createStyler(style);
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
    return `/#/org/${this.state.currentOrg.guid}/spaces/${this.state.space.guid}/${page}`;
  }

  get currentOrgName() {
    return this.state.currentOrg ? this.state.currentOrg.name : '';
  }

  get currentOrgGuid() {
    return this.state.currentOrg || '0';
  }

  render() {
    let Content = this.currentContent;
    let tabNav = <div></div>;
    let main = <div></div>;
    console.log(this.state);

    if (this.state.space && this.state.space.guid) {
      main = (
      <div className={ this.styler('grid') }>
        <div className={ this.styler('grid-width-8') }>
          <h2>Space overview</h2>
          <p className={ this.styler('page-dek') }>
            Each <a href="https://docs.cloud.gov/getting-started/concepts/">space</a> provides an environment for related applications (<a href="https://docs.cloud.gov/intro/overview/using-cloudgov-paas/">example use</a>).
          </p>
        </div>
        <div className={ this.styler('grid-width-4') }>
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
