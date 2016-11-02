
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import OrgStore from '../stores/org_store';

import createStyler from '../util/create_styler';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentOrg = OrgStore.get(currentOrgGuid);
  const spaces = (currentOrg) ? currentOrg.spaces : [];

  return {
    currentOrg,
    currentOrgGuid,
    rows: spaces.sort((a, b) => a.name.localeCompare(b.name))
  };
}

export default class SpaceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.spaceLink = this.spaceLink.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  get columns() {
    return [
      { label: 'Space Name', key: 'name' },
      { label: 'Number of Apps', key: 'app_count' },
      { label: 'Total Development Memory', key: 'mem_dev_total' },
      { label: 'Total Production Memory', key: 'mem_prod_total' }
    ];
  }

  get title() {
    return this.state.currentOrg && this.state.currentOrg.name || '';
  }

  spaceLink(spaceGuid) {
    return `/#/org/${this.state.currentOrgGuid}/spaces/${spaceGuid}`;
  }

  render() {
    let content = <h4 className="test-none_message">No spaces found</h4>;

    if (this.state.rows.length) {
      content = (
        <table sortable>
          <thead>
            <tr>
            { this.columns.map((column) =>
              <th column={ column.label } className={ column.key }
                key={ column.key }>
                { column.label }
              </th>
            )}
            </tr>
          </thead>
          <tbody>
          { this.state.rows.map((space) => {
            return (
              <tr key={ space.guid }>
                <td label="Name">
                  <a href={ this.spaceLink(space.guid) }>{ space.name }</a>
                </td>
                <td label="Number of Apps">{ space.app_count }</td>
                <td label="Total Development Memory">{ space.mem_dev_total } MB</td>
                <td label="Total Production Memory">{ space.mem_prod_total } MB</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <div>
          <h2>All spaces in your <strong>{this.title}</strong> organization</h2>
          <p className={ this.styler('page-dek') }>
          Each organization is a <a href="https://docs.cloud.gov/intro/terminology/pricing-terminology/">system</a> (<a href="https://docs.cloud.gov/getting-started/concepts/">shared perimeter</a>) that contains <a href="https://docs.cloud.gov/intro/pricing/system-stuffing/">related spaces holding related applications</a>.
          </p>
        </div>
        <div className={ this.styler('tableWrapper') }>
          { content }
        </div>
      </div>
    );
  }
}

SpaceList.propTypes = {};
