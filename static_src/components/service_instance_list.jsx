
import React from 'react';
import Reactable from 'reactable';

import formatDateTime from '../util/format_date';

import createStyler from '../util/create_styler';
import baseStyle from 'cloudgov-style/css/base.css';
import Button from './button.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';

const Table = Reactable.Table;
const Thead = Reactable.Thead;
const Th = Reactable.Th;
const Tr = Reactable.Tr;
const Td = Reactable.Td;

function stateSetter(props) {
  return {
    serviceInstances: ServiceInstanceStore.getAll(),
    currentSpaceGuid: props.initialSpaceGuid
  };
}

export default class ServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this._onChange = this._onChange.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this.styler = createStyler(baseStyle);
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
    let content = <h4 className="test-none_message">No service instances</h4>;

    if (this.state.serviceInstances.length) {
      content = (
        <Table sortable={ true }>
          <Thead>
            { this.columns.map((column) => {
              return (
                <Th column={ column.label } className={ column.key }>
                  { column.label }</Th>
              )
            })}
          </Thead>
          { this.state.serviceInstances.map((instance) => {
            const lastOp = instance.last_operation;
            const lastOpTime = lastOp.updated_at || lastOp.created_at;
            return (
              <Tr key={ instance.guid }>
                <Td column="Name"><span>{ instance.name }</span></Td>
                <Td column="Last operation">{ instance.last_operation.type }</Td>
                <Td column="Updated at">
                  { formatDateTime(lastOpTime) }
                </Td>
                <Td column="Delete">
                  <Button
                    classes={ ["test-delete_instance",
                      this.styler("usa-button-secondary")] }
                    onClickHandler={ this._handleDelete.bind(this, instance.guid)}
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
      <div className={ this.styler('tableWrapper') }>
        { content }
      </div>
    );
  }
}

ServiceInstanceList.propTypes = {
  initialOrgGuid: React.PropTypes.string,
  initialSpaceGuid: React.PropTypes.string
};
