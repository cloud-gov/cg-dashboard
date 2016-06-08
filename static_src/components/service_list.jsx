
/**
 * Renders a list of services
 */

import React from 'react';
import Reactable from 'reactable';

import ServicePlanList from './service_plan_list.jsx';

import createStyler from '../util/create_styler';
import tableStyles from 'cloudgov-style/css/base.css';

var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      services: props.initialServices
    };
    this.styler = createStyler(tableStyles);
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
      <table>
        <thead>
          { this.columns.map((column) => {
            return (
              <th className={ column.key } key={ column.key }>
                { column.label }
              </th>
            )
          })}
        </thead>
        { this.rows.map((row) => {
          return [
          <tr key={ row.guid }>
            { this.columns.map((rowcolumn) => {
              return (
                <td key={ rowcolumn.key }><span>
                  { row[rowcolumn.key] }
                </span></td>
              )
            })}
          </tr>,
          <tr colSpan="3">
            <td colSpan="3">
            <ServicePlanList initialServiceGuid={ row.guid }
                initialServicePlans={ row.servicePlans } />
            </td>
          </tr>
          ]
        })}
      </table>
      );
    }

    return (
    <div className={ this.styler('tableWrapper') }>
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
