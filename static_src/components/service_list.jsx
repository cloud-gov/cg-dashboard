
/**
 * Renders a list of services
 */

import React from 'react';
import Reactable from 'reactable';

var Table = Reactable.Table;

export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      services: props.initialServices
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({services: nextProps.initialServices});
  }

  get columns() {
    var columns = [
      { label: 'Name', key: 'label' },
      { label: 'Description', key: 'description' },
      { label: 'Date Created', key: 'created_at' }
    ];

    return columns;
  }

  get rows() {
    var rows = this.state.services;
    return rows;
  }

  render() {
    var content = <h4 className="test-none_message">No services</h4>;
    if (this.state.services.length) {
      content = (
        <Table data={ this.rows } 
          columns={ this.columns }
          sortable={ true } className="table" />
      );
    }

    return (
    <div className="tableWrapper"> 
      { content }
    </div>
    );
  }
}

ServiceList.propTypes = {
  initialServices: React.PropTypes.array
};

ServiceList.defaultProps = {
  initialServices: []
}
