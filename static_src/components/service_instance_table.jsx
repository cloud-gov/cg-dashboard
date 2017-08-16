
import React from 'react';
import Loading from './loading.jsx';
import PanelDocumentation from './panel_documentation.jsx';
import ServiceInstanceTableRow from './service_instance_table_row.jsx';
import ServiceInstanceStore from '../stores/service_instance_store.js';
import SpaceStore from '../stores/space_store.js';
import { config } from 'skin';
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
  }

  componentDidMount() {
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
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

  get serviceInstances() {
    return this.state.serviceInstances.map(instance =>
      <ServiceInstanceTableRow
        key={ instance. guid }
        instance={ instance }
        onBeginDelete={ serviceActions.deleteInstanceConfirm }
        onConfirmDelete={ serviceActions.deleteInstance }
        onCancelDelete={ serviceActions.deleteInstanceCancel }
      />);
  }

  render() {
    let content = <Loading text="Loading service instances" />;

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
              { this.serviceInstances }
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
};
