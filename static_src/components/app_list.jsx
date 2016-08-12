
import style from 'cloudgov-style/css/cloudgov-style.css';
import dedent from 'dedent';
import React from 'react';
import Reactable from 'reactable';

import createStyler from '../util/create_styler';
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
    apps: apps,
    currentOrgGuid,
    currentSpaceGuid,
    loading: SpaceStore.fetching,
    empty: SpaceStore.fetched && !apps.length
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

  getRows(apps) {
    return apps.map((app) => {
      const name = unsafe(`<a href="${this.appUrl(app)}">${app.name}</a>`);
      return Object.assign(app, { name });
    });
  }

  appUrl(app) {
    return dedent`/#/org/${this.state.currentOrgGuid}
            /spaces/${this.state.currentSpaceGuid}
            /apps/${app.guid}`;
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  get columns() {
    return [
      { label: 'App Name', key: 'name' },
      { label: 'Buildpack', key: 'detected_buildpack' },
      { label: 'Memory', key: 'memory' },
      { label: 'Instances', key: 'instances' },
      { label: 'State', key: 'state' },
      { label: 'Disk quota', key: 'disk_quota' }
    ];
  }

  render() {
    let content = <div></div>;
    let loading = <Loading text="Loading apps" active={ this.state.loading } />;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No apps</h4>;
    } else if (this.state.apps.length) {
      content = (
        <table sortable>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th column={ column.label } className={ column.key }
                key={ column.key }>
                { column.label }
              </th>
            )}
            </tr>
          </thead>
          <tbody>
          { this.state.apps.map((app) => {
            return ([
              <tr key={ app.guid }>
                <td label="Name">
                  <a href={ this.appUrl(app) }>{ app.name }</a>
                </td>
                <td label="Buildpack">{ app.buildpack }</td>
                <td label="Memory">{ app.memory } MB</td>
                <td label="Instances">{ app.instances }</td>
                <td label="State">{ app.state }</td>
                <td label="Disk quota">{ app.disk_quota } MB</td>
              </tr>
            ])
          })}
          </tbody>
        </table>
      );
    }

    return (
      <div className={ this.styler('tableWrapper') }>
        { loading }
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
