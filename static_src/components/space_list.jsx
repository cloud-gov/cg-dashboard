
import React from 'react';
import Reactable from 'reactable';

import orgActions from '../actions/org_actions';
import AppDispatcher from '../dispatcher';
import OrgStore from '../stores/org_store';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

function stateSetter() {
  var currentOrgGuid = OrgStore.currentOrgGuid,
      currentOrg = OrgStore.get(currentOrgGuid);

  return { 
    currentOrg: currentOrg,
    currentOrgGuid: currentOrgGuid,
    rows: (currentOrg && currentOrg.spaces) || []
  };
}

export default class SpaceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { rows: [], currentOrgGuid: this.props.initialOrgGuid };
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  _onChange = () => {
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

  render() {
    let rows = this.state.rows;
    for (let row of rows) {
      row.name =  unsafe('<a href="/#/spaces/' + row.guid + '">' + 
        row.name +'</a>');
    }

    let content = this.noneFound;
    if (rows.length) {
      content = <SpaceList.Table data={ rows } columns={ this.columns } 
        sortable={ true } className="table" />;
    }

    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">{ this.title }  Spaces</h3>
        </div>
        <div className="tableWrapper"> 
          { content }
        </div>
      </div>
    );
  }
}
SpaceList.Table = Table;
SpaceList.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired
}
