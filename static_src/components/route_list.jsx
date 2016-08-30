
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import PanelActions from './panel_actions.jsx';
import PanelGroup from './panel_group.jsx';
import PanelHeader from './panel_header.jsx';
import PanelRow from './panel_row.jsx';
import routeActions from '../actions/route_actions.js';
import RouteForm from './route_form.jsx';
import RouteStore from '../stores/route_store.js';

import createStyler from '../util/create_styler';

function stateSetter(appGuid) {
  const routes = RouteStore.getAll();
  const appRoutes = routes.filter((route) => route.app_guid === appGuid);

  return {
    routes: appRoutes
  };
}

window.RouteStore = RouteStore;

export default class RouteList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props.initialAppGuid);
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(style);
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
    this.setState(stateSetter(this.props.initialAppGuid));
  }

  _handleRouteAction(routeGuid, ev) {
    ev.preventDefault();
    routeActions.toggleEdit(routeGuid);
  }

  render() {
    if (this.state.routes.length === 0) {
      return (<h4 className="test-none_message">No routes</h4>);
    }
    const routeLimit = (this.props.routeLimit > -1) ? this.props.routeLimit : 'unlimited';
    const domains = this.state.routes.map((route) => route.domain);
    return (
      <PanelGroup>
        <PanelHeader>
          <strong>Routes</strong>
          <span>{ this.state.routes.length } of { routeLimit }</span>
          <PanelActions>
            <Action label="Add route" type="link">
              Add Route
            </Action>
          </PanelActions>
        </PanelHeader>
        { this.state.routes.map((route) => {
          const fullRoute = (route.path) ?
            `${route.host}.${route.domain}/${route.path}` :
            `${route.host}.${route.domain}`;
          const handler = this._handleRouteAction.bind(this, route.guid);
          let rowContent;
          if (route.editing) {
            rowContent = (
              <RouteForm route={ route } domains={ domains }
                handleCancel={ handler }
              />
            );
          } else {
            rowContent = (
              <div>
                <span>{ fullRoute }</span>
                <Action onClickHandler={ handler } label="Edit" type="link">
                  Edit
                </Action>
              </div>
            );
          }

          return (
            <PanelRow key={ route.guid }>
             { rowContent }
            </PanelRow>
          );
        })}
      </PanelGroup>
    );
  }
}

RouteList.propTypes = {
  initialAppGuid: React.PropTypes.string.isRequired,
  routeLimit: React.PropTypes.number
};

RouteList.defaultProps = {
  routeLimit: -1
};
