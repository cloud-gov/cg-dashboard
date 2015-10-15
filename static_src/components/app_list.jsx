
import React from 'react';
import Reactable from 'reactable';

var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

export default class AppList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { apps: this.props.initialApps };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      apps: nextProps.initialApps
    });
  }

  get columns() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Buildpack', key: 'buildpack' },
      { label: 'Memory', key: 'memory' },
      { label: 'Instances', key: 'instances' },
      { label: 'State', key: 'state' },
      { label: 'Disk quota', key: 'disk_quota' }
    ];
  }

  render() {
    var content = <h4 className="test-none_message">No apps</h4>;
    // TODO format rows in table
    if (this.state.apps.length) {
      content = <Table data={ this.state.apps } columns={ this.columns }
        sortable={ true } className="table" />;
    }

    return (
      <div className="tableWrapper"> 
        { content }
      </div>
    );
  }
};

AppList.propTypes = {
  initialApps: React.PropTypes.array
};

AppList.defaultProps = {
  initialApps: []
}
