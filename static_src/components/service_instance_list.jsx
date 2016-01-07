
import React from 'react';
import Reactable from 'reactable';

import Button from './button.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';

var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

function stateSetter(props) {
  return {
    serviceInstances: ServiceInstanceStore.getAll(),
    currentSpaceGuid: props.initialSpaceGuid
  };
  this._onChange = this._onChange.bind(this);
  this._handleDelete = this._handleDelete.bind(this);
}

export default class ServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ServiceInstanceStore.addChangeListener(this._onChange);
    serviceActions.fetchAllInstances(this.state.currentSpaceGuid);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  _handleDelete(instanceGuid, ev) {
    ev.preventDefault();
    serviceActions.deleteInstance(instanceGuid);
  }

  get columns() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Last operation', key: 'type' },
      { label: 'Updated at', key: 'updated_at' },
      { label: 'Delete', key: 'delete_istance' }
    ];
  }

  render() {
    var content = <h4 className="test-none_message">No service instances</h4>;

    if (this.state.serviceInstances.length) {
      content = (
        <Table className="table" sortable={ true }>
          <Thead>
            { this.columns.map((column) => {
              return (
                <Th column={ column.label } className={ column.key }>
                  { column.label }</Th>
              )
            })}
          </Thead>
          { this.state.serviceInstances.map((instance) => {
            return (
              <Tr key={ instance.guid }>
                <Td column="Name"><span>{ instance.name }</span></Td>
                <Td column="Last operation">{ instance.last_operation.type }</Td>
                <Td column="Updated at">
                  { instance.last_operation.updated_at }
                </Td>
                <Td column="Delete">
                  <Button 
                  classes={ ["test-delete_instance"] }
                  onClickHandler={ this._handleDelete.bind(this, instance.guid) } 
                  label="delete">
                    <span>Delete Instance</span>
                  </Button>
                </Td>
              </Tr>
            )
          })}
        </Table>
      );
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

