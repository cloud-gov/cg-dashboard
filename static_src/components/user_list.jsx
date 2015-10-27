
/**
 * Renders a list of users.
 */

import React from 'react';
import Reactable from 'reactable';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

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

  get columns() {
    return [
      { label: 'Name', key: 'username' },
      { label: 'Date Created', key: 'created_at' }
    ];
  }

  render() {
    var content = <h4 className="test-none_message">No users</h4>;
    if (this.state.users.length) {
      content = <Table data={ this.state.users } 
        columns={ this.columns }
        sortable={ true } className="table" />;
    }

    return (
    <div className="tableWrapper"> 
      { content }
    </div>
    );
  }

};

UserList.propTypes = {
  initialUsers: React.PropTypes.array
};

UserList.defaultProps = {
  initialUsers: []
}
