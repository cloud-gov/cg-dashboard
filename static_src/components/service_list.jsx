
import React from 'react';
import Reactable from 'reactable';

import serviceActions from '../actions/service_actions.js';
import ServiceStore from '../stores/service_store.js';

var Table = Reactable.Table;

function stateSetter(props) {
  return {
    serviceInstances: ServiceStore.getAll(),
    currentSpaceGuid: props.initialSpaceGuid
  };
}

export default class ServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
  }

  componentDidMount() {
    ServiceStore.addChangeListener(this._onChange);
    serviceActions.fetchAllInstances(this.state.currentSpaceGuid);
  }

  _onChange = () => {
    this.setState(stateSetter(this.props));
  }

  get columns() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Last operation', key: 'last_operation.type' },
      { label: 'Updated at', key: 'last_operation.updated_at' },
      { label: '', key: '' }
    ];
  }

  render() {
    var content = <h4 className="test-none_message">No service instances</h4>;
    if (this.state.serviceInstances.length) {
      content = <Table 
        className="table"
        data={ this.state.serviceInstances } 
        columns={ this.columns }
        sortable={ true } />;
    }

    return (
      <div className="tableWrapper"> 
        { content }
      </div>
    );
  }
};

ServiceInstanceList.propTypes = {
  initialOrgGuid: React.PropTypes.string,
  initialSpaceGuid: React.PropTypes.string
};
