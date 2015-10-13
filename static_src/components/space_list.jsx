
import React from 'react';
import Reactable from 'reactable';

import orgActions from '../actions/org_actions';
import AppDispatcher from '../dispatcher';
import OrgStore from '../stores/org_store';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

function stateSetter() {
  var currentOrg = OrgStore.currentOrg,
      org;

  if (currentOrg) {
    org = OrgStore.get(currentOrg.guid);
    if (!org) {
      orgActions.fetch(currentOrg.guid);
    }
  }

  return { 
    currentOrg: currentOrg,
    rows: (org && org.spaces) || []
  };
}

export default class SpaceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { rows: [], currentOrg: null };
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
    if (this.state.currentOrg) {
      orgActions.fetch(this.state.currentOrg.guid);
    }
  }

  _onChange = () => {
    this.setState(stateSetter());
  }

  render() {
    var columns = [
      { label: 'Name', key: 'name' },
      { label: 'Number of Apps', key: 'app_count' },
      { label: 'Total Development Memory', key: 'mem_dev_total' },
      { label: 'Total Production Memory', key: 'mem_prod_total' }
    ];

    let rows = this.state.rows;
    for (let row of rows) {
      row.name =  unsafe('<a href="/#/spaces/' + row.guid + '">' + 
        row.name +'</a>');
    }

    let title = this.state.currentOrg && this.state.currentOrg.name || '';

    let content = <h4 className="test-none_message">No spaces found</h4>;
    if (rows.length) {
      content = <SpaceList.Table data={ rows } columns={ columns } 
        sortable={ true } className="table" />;
    }

    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">{ title }  Spaces</h3>
        </div>
        <div className="tableWrapper"> 
          { content }
        </div>
      </div>
    );
  }
}
SpaceList.Table = Table;
