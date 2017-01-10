
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import ContentsTreeApp from './contents_tree_app.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
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
    let content = <div className={ this.styler('loading-container')}>{ loading }</div>;

    if (this.state.empty) {
      content = (
        <div className={ this.styler('panel-content') }>
          <h4 className="test-none_message">No apps</h4>
        </div>
      );
    } else if (!this.state.loading && this.state.apps.length > 0) {
      content = (
        <div className={ this.styler('panel-content') }>
          <div className={ this.styler('panel-row-header') }>Apps</div>
          { this.state.apps.map((app) =>
            <ContentsTreeApp
              key={ app.guid }
              app={ app }
              orgGuid={ this.state.currentOrgGuid }
              spaceGuid={ this.state.currentSpaceGuid }
              spaceName={ this.state.currentSpaceName }
              extraInfo={ ['state', 'memory', 'diskQuota'] }
            />
          )}
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
