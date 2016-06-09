
import dedent from 'dedent';
import React from 'react';
import Reactable from 'reactable';

import createStyler from '../util/create_styler';

import SpaceStore from '../stores/space_store.js';
import tableStyles from 'cloudgov-style/css/base.css';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

function stateSetter(props) {
  var space = SpaceStore.get(props.initialSpaceGuid);

  return {
    apps: space && space.apps || [],
    currentOrgGuid: props.initialOrgGuid,
    currentSpaceGuid: props.initialSpaceGuid
  }
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

  _onChange() {
    this.setState(stateSetter(this.props));
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
    var content = <h4 className="test-none_message">No apps</h4>;
    // TODO format rows in table
    if (this.state.apps.length) {
      content = <Table data={ this.getRows(this.state.apps) }
        columns={ this.columns }
        sortable={ true } />;
    }

    return (
      <div className={ this.styler('tableWrapper') }>
        { content }
      </div>
    );
  }
};

AppList.propTypes = {
  initialApps: React.PropTypes.array,
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

AppList.defaultProps = {
  initialApps: []
}
