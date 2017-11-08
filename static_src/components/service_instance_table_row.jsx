import PropTypes from "prop-types";
import React from "react";
import Action from "./action.jsx";
import ConfirmationBox from "./confirmation_box.jsx";
import formatDateTime from "../util/format_date";

const propTypes = {
  instance: PropTypes.object,
  onBeginDelete: PropTypes.func,
  onCancelDelete: PropTypes.func,
  onConfirmDelete: PropTypes.func
};

class ServiceInstanceTableRow extends React.Component {
  constructor(props) {
    super(props);

    this.handleBeginDelete = this.handleBeginDelete.bind(this);
    this.handleCancelDelete = this.handleCancelDelete.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  handleBeginDelete() {
    this.props.onBeginDelete(this.props.instance.guid);
  }

  handleCancelDelete() {
    this.props.onCancelDelete(this.props.instance.guid);
  }

  handleConfirmDelete() {
    this.props.onConfirmDelete(this.props.instance.guid);
  }

  get confirmationBox() {
    const { instance } = this.props;

    return !instance.confirmDelete ? null : (
      <ConfirmationBox
        style="nexto"
        confirmHandler={this.handleConfirmDelete}
        cancelHandler={this.handleCancelDelete}
        disabled={instance.deleting}
        message={null}
      />
    );
  }

  render() {
    const { instance } = this.props;
    const { last_operation: lastOp } = instance;
    const lastOpTime = lastOp.updated_at || lastOp.created_at;
    const specialtdStyles = {
      whiteSpace: "nowrap",
      width: "25%"
    };

    return (
      <tr>
        <td>{instance.name}</td>
        <td>{lastOp.type}</td>
        <td>{formatDateTime(lastOpTime)}</td>
        <td style={specialtdStyles}>
          <div>
            <Action
              style="base"
              classes={["test-delete_instance"]}
              disabled={instance.confirmDelete}
              clickHandler={this.handleBeginDelete}
              label="delete"
            >
              <span>Delete Instance</span>
            </Action>
          </div>
          {this.confirmationBox}
        </td>
      </tr>
    );
  }
}

ServiceInstanceTableRow.propTypes = propTypes;

export default ServiceInstanceTableRow;
