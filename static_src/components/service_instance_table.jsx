
import React from 'react';

import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import Loading from './loading.jsx';
import PanelDocumentation from './panel_documentation.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import SpaceStore from '../stores/space_store.js';
import { config } from 'skin';
import formatDateTime from '../util/format_date';
import serviceActions from '../actions/service_actions.js';

function stateSetter() {
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const serviceInstances = ServiceInstanceStore.getAllBySpaceGuid(
    currentSpaceGuid);

  return {
    serviceInstances,
    currentSpaceGuid,
    loading: ServiceInstanceStore.loading,
    empty: !ServiceInstanceStore.loading && !serviceInstances.length,
    updating: ServiceInstanceStore.updating
  };
}

export default class ServiceInstanceTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleDeleteConfirmation = this._handleDeleteConfirmation.bind(this);
    this._handleDeleteCancel = this._handleDeleteCancel.bind(this);
  }

  componentDidMount() {
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _handleDelete(instanceGuid, ev) {
    ev.preventDefault();
    serviceActions.deleteInstance(instanceGuid);
  }

  _handleDeleteConfirmation(instanceGuid, ev) {
    ev.preventDefault();
    serviceActions.deleteInstanceConfirm(instanceGuid);
  }

  _handleDeleteCancel(instanceGuid, ev) {
    ev.preventDefault();
    serviceActions.deleteInstanceCancel(instanceGuid);
  }

  get columns() {
    return [
      { label: 'Service Instance Name', key: 'name' },
      { label: 'Last operation', key: 'type' },
      { label: 'Updated at', key: 'updated_at' },
      { label: 'Delete', key: 'delete_istance' }
    ];
  }

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          To create service instances for this space, use this org’s marketplace (at left or on the command line). Then bind instances to apps using the command line.
          { config.docs.managed_services &&
            <span>
              (<a href={ config.docs.managed_services }>Learn about using service instances and marketplaces</a>.)
            </span>
          }
        </p>
      </PanelDocumentation>
    );
  }

  renderConfirmationBox(instanceGuid) {
    return (
      <ConfirmationBox
        style="nexto"
        confirmHandler={ this._handleDelete.bind(this, instanceGuid) }
        cancelHandler={ this._handleDeleteCancel.bind(this, instanceGuid) }
        disabled={ this.state.updating }
      />
    );
  }

  render() {
    let loading = <Loading text="Loading service instances" />;
    let content = <div>{ loading }</div>;

    const specialtdStyles = {
      whiteSpace: 'nowrap',
      width: '25%'
    };

    if (this.state.empty) {
      content = <h4 className="test-none_message">No service instances</h4>;
    } else if (!this.state.loading && this.state.serviceInstances.length) {
      content = (
      <div>
        { this.documentation }
        <Loading
          style="globalSaving"
          text="Deleting service instance"
          active={ this.state.updating }
        />
        <table>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th className={ column.key } key={ column.key }>
                { column.label }
              </th>
            )}
            </tr>
          </thead>
          <tbody>
          { this.state.serviceInstances.map((instance) => {
            const lastOp = instance.last_operation;
            const lastOpTime = lastOp.updated_at || lastOp.created_at;
            return (
              <tr key={ instance.guid }>
                <td><span>{ instance.name }</span></td>
                <td>{ instance.last_operation.type }</td>
                <td>
                  { formatDateTime(lastOpTime) }
                </td>
                <td style={specialtdStyles}>
                  <span>
                    <div>
                      <Action
                        style="base"
                        classes={ ['test-delete_instance'] }
                        disabled={instance.confirmDelete}
                        clickHandler={ this._handleDeleteConfirmation.bind(
                            this, instance.guid)}
                        label="delete"
                      >
                        <span>Delete Instance</span>
                      </Action>
                    </div>
                    { (instance.confirmDelete) ? this.renderConfirmationBox(
                      instance.guid) : '' }
                  </span>
                </td>
              </tr>
              );
          })}
          </tbody>
        </table>
      </div>
      );
    }

    return (
      <div className="tableWrapper">
        { content }
      </div>
    );
  }
}

ServiceInstanceTable.propTypes = { };
