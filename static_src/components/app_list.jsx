
import React from 'react';

import dedent from 'dedent';
import style from 'cloudgov-style/css/cloudgov-style.css';

import { appStates } from '../constants.js';
import createStyler from '../util/create_styler';
import AppQuicklook from './app_quicklook.jsx';
import EntityIcon from './entity_icon.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import PanelRow from './panel_row.jsx';
import SpaceStore from '../stores/space_store.js';


function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;

  const space = SpaceStore.get(currentSpaceGuid);
  const apps = (space && space.apps) ? space.apps : [];

  return {
    apps: apps.sort((a, b) => a.name.localeCompare(b.name)),
    currentOrgGuid,
    currentSpaceGuid,
    currentSpaceName: SpaceStore.currentSpaceName,
    loading: SpaceStore.loading,
    empty: !SpaceStore.loading && !apps.length
  };
}

export default class AppList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  render() {
    let loading = <Loading text="Loading apps" />;
    let content = <div>{ loading }</div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No apps</h4>;
    } else if (!this.state.loading && this.state.apps.length > 0) {
      content = (
        <div>
          <div className={ this.styler('panel-row-header') }>
            <span>Apps in</span> <EntityIcon entity="space" />
            <span> { this.state.currentSpaceName }</span>
          </div>
          { this.state.apps.map((app) => {
            return (
             <AppQuicklook
                key={ app.guid }
                app={ app }
                orgGuid={ this.state.currentOrgGuid }
                spaceGuid={ this.state.currentSpaceGuid }
                spaceName={ this.state.currentSpaceName }
                extraInfo={ ['state', 'memory', 'diskQuota'] }
              />
            );
          })}
        </div>
      );
    }

    return content;
  }
}

AppList.propTypes = {
  initialApps: React.PropTypes.array
};

AppList.defaultProps = {
  initialApps: []
};
