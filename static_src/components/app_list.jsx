
import dedent from 'dedent';
import React from 'react';
import Reactable from 'reactable';

import createStyler from '../util/create_styler';
import Loading from './loading.jsx';
import SpaceStore from '../stores/space_store.js';
import tableStyles from 'cloudgov-style/css/base.css';

const unsafe = Reactable.unsafe;

function stateSetter(props) {
  const space = SpaceStore.get(props.initialSpaceGuid);

  return {
    apps: space && space.apps || [],
    currentOrgGuid: props.initialOrgGuid,
    currentSpaceGuid: props.initialSpaceGuid,
    loading: SpaceStore.fetching
  };
}

export default class AppList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this.state.apps = props.initialApps;
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(tableStyles);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateSetter(nextProps));
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
  }

  appUrl(app) {
    return dedent`/#/org/${ this.state.currentOrgGuid }
            /spaces/${ this.state.currentSpaceGuid }
            /apps/${ app.guid }`;
  }

  getRows(apps) {
    return apps.map((app) => {
      const name = unsafe(`<a href="${this.appUrl(app)}">${app.name}</a>`);
      return Object.assign(app, { name });
    });
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  get columns() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Buildpack', key: 'detected_buildpack' },
      { label: 'Memory', key: 'memory' },
      { label: 'Instances', key: 'instances' },
      { label: 'State', key: 'state' },
      { label: 'Disk quota', key: 'disk_quota' }
    ];
  }

  render() {
    let content = <h4 className="test-none_message">No apps</h4>;

    if (this.state.loading) {
      content = <Loading text="Loading apps" />;
    } else if (this.state.apps.length) {
      content = (
        <table sortable>
          <thead>
            <tr>
            { this.columns.map((column) => {
              return (
                <th column={ column.label } className={ column.key }
                    key={ column.key }>
                  { column.label }
                </th>
              )
            })}
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
        { content }
      </div>
    );
  }
}

AppList.propTypes = {
  initialApps: React.PropTypes.array,
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

AppList.defaultProps = {
  initialApps: []
};
