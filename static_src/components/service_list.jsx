
/**
 * Renders a list of services
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import ServicePlanList from './service_plan_list.jsx';
import createStyler from '../util/create_styler';


export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      services: props.initialServices
    };
    this.styler = createStyler(style);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ services: nextProps.initialServices });
  }

  get columns() {
    const columns = [
      { label: 'Name', key: 'label' },
      { label: 'Description', key: 'description' },
      { label: 'Date Created', key: 'created_at' }
    ];

    return columns;
  }

  get rows() {
    const rows = this.state.services;
    return rows;
  }

  render() {
    let content = <h4 className="test-none_message">No services</h4>;
    if (this.state.services.length) {
      content = (
      <div>
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
          { this.rows.map((row) =>
            [
              <tr key={ row.guid }>
                { this.columns.map((rowcolumn) =>
                  <td key={ rowcolumn.key }><span>
                    { row[rowcolumn.key] }
                  </span></td>
                )}
              </tr>,
              <tr colSpan="3">
                <td colSpan="3">
                <ServicePlanList initialServiceGuid={ row.guid }
                  initialServicePlans={ row.servicePlans }
                />
                </td>
              </tr>
            ]
          )}
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

ServiceList.propTypes = {
  initialServices: React.PropTypes.array
};

ServiceList.defaultProps = {
  initialServices: []
};
