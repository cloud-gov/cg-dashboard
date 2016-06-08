
import React from 'react';
import Reactable from 'reactable';

import AppDispatcher from '../dispatcher';
import OrgStore from '../stores/org_store';

import createStyler from '../util/create_styler';
import tableStyles from 'cloudgov-style/css/base.css';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

function stateSetter() {
  var currentOrgGuid = OrgStore.currentOrgGuid,
      currentOrg = OrgStore.get(currentOrgGuid);

  return {
    currentOrg,
    currentOrgGuid,
    rows: (currentOrg) ? currentOrg.spaces : []
  };
}

export default class SpaceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { rows: [], currentOrgGuid: this.props.initialOrgGuid };
    this._onChange = this._onChange.bind(this);
    this.spaceLink = this.spaceLink.bind(this);
    this.styler = createStyler(navStyles);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  get columns() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Number of Apps', key: 'app_count' },
      { label: 'Total Development Memory', key: 'mem_dev_total' },
      { label: 'Total Production Memory', key: 'mem_prod_total' }
    ];
  }

  get title() {
    return this.state.currentOrg && this.state.currentOrg.name || '';
  }

  get noneFound() {
    return <h4 className="test-none_message">No spaces found</h4>
  }

  spaceLink(spaceGuid) {
    return `/#/org/${this.state.currentOrgGuid}/spaces/${spaceGuid}`;
  }

  render() {
    let rows = this.state.rows.map((row) => {
      const name = unsafe(`<a href=${this.spaceLink(row.guid)}>${row.name}</a>`);
      return Object.assign({}, row, { name });
    });

    let content = this.noneFound;
    if (rows.length) {
      content = (
        <SpaceList.Table data={ rows } columns={ this.columns } sortable />
      );
    }

    return (
      <div>
        <div>
          <h3>{ this.title }  Spaces</h3>
        </div>
        <div className={ this.styler('tableWrapper') }>
          { content }
        </div>
      </div>
    );
  }
}
SpaceList.Table = Table;
SpaceList.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired
};
