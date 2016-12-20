
import style from 'cloudgov-style/css/cloudgov-style.css';
import dedent from 'dedent';
import React from 'react';
import Reactable from 'reactable';

import { appStates } from '../constants.js';
import createStyler from '../util/create_styler';
import EntityIcon from './entity_icon.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';

const unsafe = Reactable.unsafe;

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

  appURL(app) {
    return dedent`/#/org/${this.state.currentOrgGuid}
            /spaces/${this.state.currentSpaceGuid}
            /apps/${app.guid}`;
  }

  appName(app) {
    return <a href={ this.appURL(app) }>{ app.name }</a>
  }

  render() {
    let loading = <Loading text="Loading apps" />;
    let content = <div>{ loading }</div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No apps</h4>;
    } else if (!this.state.loading && this.state.apps.length > 0) {
      content = (
        <table>
          <thead>
            <tr>
              <th>
                <span>Apps in</span> <EntityIcon entity="space" />
                <span> { this.state.currentSpaceName }</span>
              </th>
              <th>
                Memory allocated
              </th>
              <th>
                Memory limit
              </th>
            </tr>
          </thead>
          <tbody>
          { this.state.apps.map((app) => {
            let crashed = (app.state === appStates.crashed) &&
              (<span className={ this.styler('status', app.state.toLowerCase()) }>
                { app.state.toLowerCase() }
              </span>);
            return ([
              <tr key={ app.guid }>
                <td label="Name">
                  <h4 className={ this.styler('sans-s5') }>
                    <EntityIcon entity="app" state={ app.state } />
                    <span>
                      { this.state.currentSpaceName } / { this.appName(app) }
                    </span>
                    <span>{ crashed }</span>
                  </h4>
                </td>
                <td label="Allocation">{ app.memory } MB <br /></td>
                <td label="Limit">{ app.disk_quota } MB <br /></td>
              </tr>
            ])
          })}
          </tbody>
        </table>
      );
    }

    return (
      <div className={ this.styler('tableWrapper') }>
        { content }
      </div>
    );
  }
}

AppList.propTypes = {
  initialApps: React.PropTypes.array
};

AppList.defaultProps = {
  initialApps: []
};
