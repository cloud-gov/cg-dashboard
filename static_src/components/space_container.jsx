
import React from 'react';

import Action from './action.jsx';
import AppCountStatus from './app_count_status.jsx';
import AppList from '../components/app_list.jsx';
import Marketplace from './marketplace.jsx';
import OrgStore from '../stores/org_store.js';
import Panel from './panel.jsx';
import PanelActions from './panel_actions.jsx';
import ServiceCountStatus from './service_count_status.jsx';
import ServiceInstanceList from '../components/service_instance_list.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import { config } from 'skin';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

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
    this.handleNewService = this.handleNewService.bind(this);
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

  handleNewService(ev) {
    ev.preventDefault();
    window.location.href = `/#/org/${this.state.currentOrg.guid}/marketplace`;
  }

  render() {
    let Content = this.currentContent;
    let tabNav = <div></div>;
    let main = <div></div>;

    if (this.state.space && this.state.space.guid) {
      const space = this.state.space;
      main = (
      <div>
        <div className={ this.styler('grid') }>
          <div className={ this.styler('grid-width-8') }>
            <h2>Space overview</h2>
          </div>
          <div className={ this.styler('grid-width-4') }>
            <AppCountStatus apps={ space.apps } appCount={ space.apps && space.apps.length } />
            <ServiceCountStatus services={ space.services }
              serviceCount={ space.services && space.services.length }
            />
          </div>
        </div>
        <Panel title="">
          <AppList />
          <PanelActions>
            <span>Learn how to <a href={ config.docs.deploying_apps }>deploy a
            new app</a>.</span>
            <Action
            label="Add a new service instance"
            classes={ ['panel-actions-right'] }
            clickHandler={ this.handleNewService }
            >
              Add a new service instance
            </Action>
          </PanelActions>
        </Panel>
        <Panel title="Space users">
          <Users />
        </Panel>
        <Panel title="Service instances">
          <ServiceInstanceList />
        </Panel>
        <Panel title="Marketplace">
          <Marketplace />
        </Panel>
      </div>
      );
    }

    return main;
  }
};

SpaceContainer.propTypes = {
  currentPage: React.PropTypes.string
};

SpaceContainer.defaultProps = {
  currentPage: 'apps'
};
