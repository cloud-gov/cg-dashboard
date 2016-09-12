
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import AppStore from '../stores/app_store.js';
import Action from './action.jsx';
import DomainStore from '../stores/domain_store.js';
import PanelActions from './panel_actions.jsx';
import PanelGroup from './panel_group.jsx';
import PanelHeader from './panel_header.jsx';
import PanelRow from './panel_row.jsx';
import routeActions from '../actions/route_actions.js';
import RouteForm from './route_form.jsx';
import RouteStore from '../stores/route_store.js';
import SpaceStore from '../stores/space_store.js';

import createStyler from '../util/create_styler';
import formatRoute from '../util/format_route';

function stateSetter() {
  const routes = RouteStore.getAll().map((route) => {
    const domain = DomainStore.get(route.domain_guid);
    if (!domain) return route;
    return Object.assign({}, route, { domain_name: domain.name });
  });
  const appGuid = AppStore.currentAppGuid;
  const appRoutes = routes.filter((route) => route.app_guid === appGuid)
    .map((route) => {
      if (route.path && (route.path[0] === '/')) {
        route.path = route.path.replace('/', '');
      }

      return route;
    });

  return {
    appGuid,
    routes: appRoutes,
    spaceGuid: SpaceStore.currentSpaceGuid,
    showCreateForm: RouteStore.showCreateRouteForm,
    error: RouteStore.error
  };
}

export default class RouteList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
    this._createRouteAndAssociate = this._createRouteAndAssociate.bind(this);
    this._addCreateRouteForm = this._addCreateRouteForm.bind(this);
    this._removeCreateRouteForm = this._removeCreateRouteForm.bind(this);
  }

  componentDidMount() {
    DomainStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    DomainStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _toggleEditRoute(routeGuid, event) {
    event.preventDefault();
    routeActions.toggleEdit(routeGuid);
  }

  _addCreateRouteForm(event) {
    if (event) event.preventDefault();
    routeActions.showCreateForm();
  }

  _removeCreateRouteForm() {
    routeActions.hideCreateForm();
  }

  _createRouteAndAssociate(route) {
    const { appGuid, spaceGuid } = this.state;
    const domainGuid = route.domain_guid;
    routeActions.createRouteAndAssociate(appGuid, domainGuid, spaceGuid, route);
  }

  _deleteRoute(routeGuid, event) {
    event.preventDefault();
    routeActions.deleteRoute(routeGuid);
  }

  _updateRoute(routeGuid, route) {
    const domainGuid = route.domain_guid;
    const spaceGuid = this.state.spaceGuid;
    let path = route.path;
    if (route.path && (route.path[0] !== '/')) {
      path = `/${route.path}`;
    }
    const updatedRoute = Object.assign({}, route, { path });
    routeActions.updateRoute(routeGuid, domainGuid, spaceGuid, updatedRoute);
  }

  get addRouteAction() {
    if (this.state.showCreateForm) return null;
    return (
      <Action clickHandler={ this._addCreateRouteForm }
        label="Add route" type="button" style="outline"
      >
        Add route
      </Action>
    );
  }

  get createRouteForm() {
    if (!this.state.showCreateForm) return null;

    return (
      <RouteForm domains={ DomainStore.getAll() }
        error={ this.state.error }
        cancelHandler={ () => this._removeCreateRouteForm() }
        submitHandler={ this._createRouteAndAssociate }
      />
    );
  }

  render() {
    if (this.state.routes.length === 0) {
      return (
        <PanelRow>
          <h4 className="test-none_message">No routes</h4>
        </PanelRow>
      );
    }
    const routeLimit = (this.props.routeLimit > -1) ? this.props.routeLimit : 'unlimited';
    return (
      <PanelGroup>
        <PanelHeader>
          <h3>Routes</h3>
          <PanelActions>
            <span>{ this.state.routes.length } of { routeLimit }</span>
            { this.addRouteAction }
          </PanelActions>
        </PanelHeader>
        { this.createRouteForm }
        { this.state.routes.map((route) => {
          const submitHandler = this._updateRoute.bind(this, route.guid);
          const toggleHandler = this._toggleEditRoute.bind(this, route.guid);
          const deleteHandler = this._deleteRoute.bind(this, route.guid);
          const { domain_name, host, path } = route;
          const url = formatRoute(domain_name, host, path);
          let rowContent;

          if (route.editing) {
            rowContent = (
              <RouteForm route={ route } domains={ DomainStore.getAll() }
                cancelHandler={ toggleHandler }
                submitHandler={ submitHandler }
                deleteHandler={ deleteHandler }
              />
            );
          } else {
            rowContent = (
              <div>
                <span>{ url }</span>
                <Action clickHandler={ toggleHandler } label="Edit route" type="link">
                  Edit route
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
  routeLimit: React.PropTypes.number
};

RouteList.defaultProps = {
  routeLimit: -1
};
