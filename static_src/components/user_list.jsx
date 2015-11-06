
/**
 * Renders a list of users.
 */

import React from 'react';
import Reactable from 'reactable';

import Button from './button.jsx';

var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      users: props.initialUsers
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({users: nextProps.initialUsers});
  }

  _handleDelete = (userGuid, ev) => {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    var columns = [
      { label: 'Name', key: 'username' },
      { label: 'Date Created', key: 'created_at' }
    ];

    if (this.props.onRemove) {
      columns.push({ label: 'Actions', key: 'actions' });
    }

    return columns;
  }

  render() {
    var content = <h4 className="test-none_message">No users</h4>;
    if (this.state.users.length) {
      content = (
      <Table sortable={ true } className="table">
        <Thead>
          { this.columns.map((column) => {
            return (
              <Th column={ column.label } className={ column.key }>
                { column.label }</Th>
            )
          })}
        </Thead>
        { this.state.users.map((user) => {
          var actions;
          if (this.props.onRemove) {
            actions = (
              <Td column="Actions">
                <Button 
                onClickHandler={ this._handleDelete.bind(this, user.guid) } 
                label="delete">
                  <span>Remove User From Org</span>
                </Button>
              </Td>
            );
          } 
          return (
            <Tr key={ user.guid }>
              <Td column="Name"><span>{ user.username }</span></Td>
              <Td column="Date Created">{ user.created_at }</Td>
              { actions }
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

UserList.propTypes = {
  initialUsers: React.PropTypes.array,
  // Set to a function when there should be a remove button.
  onRemove: React.PropTypes.function
};

UserList.defaultProps = {
  initialUsers: []
}
