
import React from 'react';

import RouteStore from '../stores/route_store.js';

import createStyler from '../util/create_styler';
import tableStyles from 'cloudgov-style/css/base.css';

function stateSetter(appGuid) {
  const routes = RouteStore.getAll();
  const appRoutes = routes.filter((route) => route.appGuid === appGuid);

  return {
    routes: appRoutes
  }
}

export default class RouteList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props.initialAppGuid);
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(tableStyles);
  }

  componentDidMount() {
    RouteStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateSetter(nextProps.initialAppGuid));
  }

  componentWillUnmount() {
    RouteStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  get columns() {
    return [
      { label: 'Host', key: 'host' },
      { label: 'Path', key: 'path' }
    ];
  }

  render() {
    var content = <h4 className="test-none_message">No routes</h4>;

    if (this.state.routes.length) {
      content = (
        <table>
          <thead>
            <tr>
              { this.columns.map((column) =>
                               <th key={column.key}>{column.label}</th>) }
            </tr>
          </thead>
          <tbody>
          { this.state.routes.map((route) => {
            return (
              <tr key={route.guid}>
                { this.columns.map((column) =>
                   <td key={route.guid + column.key}>{route[column.key]}</td>) }
              </tr>
            )
          })}
          </tbody>
        </table>
      );
    }

    return (
      <div className={ this.styler('tableWrapper') }>
        { content }
        <aside>
          <p>To modify, create or delete a route, view <a
            href="https://docs.cloud.gov/apps/custom-domains/#application-routes"
            target="_blank">
            <span>&nbsp;</span>application routes</a> for more information.
          </p>
        </aside>
      </div>
    );
  }
};

RouteList.propTypes = {
  initialAppGuid: React.PropTypes.string.isRequired
};
