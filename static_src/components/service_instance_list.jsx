
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import formatDateTime from '../util/format_date';

import createStyler from '../util/create_styler';

import Button from './button.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import Loading from './loading.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceInstanceStore from '../stores/service_instance_store.js';

function stateSetter(props) {
  return {
    serviceInstances: ServiceInstanceStore.getAll(),
    currentSpaceGuid: props.initialSpaceGuid,
    loading: ServiceInstanceStore.fetching
  };
}

export default class ServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this._onChange = this._onChange.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleDeleteConfirmation = this._handleDeleteConfirmation.bind(this);
    this._handleDeleteCancel = this._handleDeleteCancel.bind(this);
    this.renderConfirmationBox = this.renderConfirmationBox.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
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

  renderConfirmationBox(instanceGuid) {
    return (
      <ConfirmationBox
        confirmHandler={ this._handleDelete.bind(this, instanceGuid) }
        cancelHandler={ this._handleDeleteCancel.bind(this, instanceGuid) }
      />
    );
  }

  render() {
    let content = <h4 className="test-none_message">No service instances</h4>;
    const specialtdStyles = {
      whiteSpace: 'nowrap',
      width: '25%'
    };

    if (this.state.loading) {
      content = <Loading text="Loading service instances" />;
    } else if (this.state.serviceInstances.length) {
      content = (
      <div>
        <p><em>
          To create service instances for this space, use this org’s marketplace (at left or on the command line). Then bind instances to apps using the command line. (<a href="https://docs.cloud.gov/apps/managed-services/">Learn about using service instances and marketplaces</a>.)
        </em></p>
        <table>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th column={ column.label } className={ column.key }
                key={ column.key }>
                { column.label }</th>
            )}
            </tr>
          </thead>
          <tbody>
          { this.state.serviceInstances.map((instance) => {
            const lastOp = instance.last_operation;
            const lastOpTime = lastOp.updated_at || lastOp.created_at;
            return (
              <tr key={ instance.guid }>
                <td column="Name"><span>{ instance.name }</span></td>
                <td column="Last operation">{ instance.last_operation.type }</td>
                <td column="Updated at">
                  { formatDateTime(lastOpTime) }
                </td>
                <td column="Delete" style={specialtdStyles}>
                  <span>
                    <div style={{ float: 'left' }}>
                      <Button
                        classes={ ['test-delete_instance',
                          (instance.confirmDelete) ?
                          '' : this.styler('usa-button-secondary'),
                          (instance.confirmDelete) ?
                            this.styler('usa-button-disabled') : '']}
                        onClickHandler={ this._handleDeleteConfirmation.bind(
                            this, instance.guid)}
                        disabled={instance.confirmDelete}
                        label="delete">
                        <span>Delete Instance</span>
                      </Button>
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
