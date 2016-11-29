
/**
 * Renders a list of services
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import ServiceStore from '../stores/service_store.js';
import ServicePlanList from './service_plan_list.jsx';
import createStyler from '../util/create_styler';

function stateSetter(props) {
  const services = props.initialServices;

  return {
    empty: !ServiceStore.loading && !services.length,
    services
  }
}


export default class ServiceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);
    this.styler = createStyler(style);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateSetter(nextProps));
  }

  get columns() {
    const columns = [
      { label: 'Service Name', key: 'label' },
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
    let content = <div></div>;

    if (this.state.empty) {
      let content = <h4 className="test-none_message">No services</h4>;
    } else if (this.state.services.length) {
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
          { this.rows.map((row) => {
            let instance = [];
            instance.push(
              <tr key={ row.guid }>
                { this.columns.map((rowcolumn) =>
                  <td key={ rowcolumn.key }><span>
                    { row[rowcolumn.key] }
                  </span></td>
                )}
              </tr>
            );
            if (row.servicePlans.length) {
              instance.push(
                <tr colSpan="3">
                  <td colSpan="3">
                  <ServicePlanList initialServiceGuid={ row.guid }
                    initialServicePlans={ row.servicePlans }
                  />
                  </td>
                </tr>
              );
            }
            return instance;
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

ServiceList.propTypes = {
  initialServices: React.PropTypes.array
};

ServiceList.defaultProps = {
  initialServices: []
};
