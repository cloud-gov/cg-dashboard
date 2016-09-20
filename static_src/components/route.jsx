
import React from 'react';

import Action from './action.jsx';
import DomainStore from '../stores/domain_store.js';
import PanelActions from './panel_actions.jsx';
import RouteForm from './route_form.jsx';
import createStyler from '../util/create_styler';
import formatRoute from '../util/format_route';
import routeActions from '../actions/route_actions.js';
import style from 'cloudgov-style/css/cloudgov-style.css';


const propTypes = {
  appGuid: React.PropTypes.string.isRequired,
  route: React.PropTypes.object
};

const defaultProps = {
  route: {}
};

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);

    this._deleteHandler = this._deleteHandler.bind(this);
    this._unbindHandler = this._unbindHandler.bind(this);
    this._bindHandler = this._bindHandler.bind(this);
    this._editHandler = this._editHandler.bind(this);
    this._updateRoute = this._updateRoute.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  _deleteHandler(ev) {
    // TODO confirmation
    ev.preventDefault();
    routeActions.deleteRoute(this.props.route.guid);
  }

  _editHandler(ev) {
    ev.preventDefault();
    routeActions.toggleEdit(this.props.route.guid);
  }

  _bindHandler(ev) {
    ev.preventDefault();
    const route = this.props.route;
    routeActions.associateApp(route.guid, this.props.appGuid);
  }

  _unbindHandler(ev) {
    // TODO confirmation
    ev.preventDefault();
    const route = this.props.route;
    routeActions.unassociateApp(route.guid, route.app_guid);
  }

  _updateRoute(route) {
    // TODO fix
    const routeGuid = this.props.route.guid;
    const domainGuid = route.domain_guid;
    const spaceGuid = route.space_guid;
    let path = route.path;
    if (route.path && (route.path[0] !== '/')) {
      path = `/${route.path}`;
    }
    const updatedRoute = Object.assign({}, route, { path });
    routeActions.updateRoute(routeGuid, domainGuid, spaceGuid, updatedRoute);
  }

  get deleteAction() {
    return (
      <Action key="delete" label="Delete route" type="link" style="cautious"
        clickHandler={this._deleteHandler}
      >
        Delete
      </Action>
    );
  }

  get editAction() {
    return (
      <Action key="edit" label="Edit route" type="button" style="outline"
        clickHandler={this._editHandler}
      >
        Edit
      </Action>
    );
  }

  bindAction(unbind) {
    return (
      <Action key="unbind" label={ (!!unbind) ? 'Unbind' : 'Bind' } style="outline"
        clickHandler={ (!!unbind) ? this._unbindHandler : this._bindHandler }
      >
        { (!!unbind) ? 'Unbind' : 'Bind' }
      </Action>
    );
  }

  get actions() {
    const actions = [];
    const route = this.props.route;
    if (!route) return actions;

    if (!route.app_guid) actions.push(this.deleteAction);
    if (route.app_guid) actions.push(this.editAction);
    actions.push(this.bindAction(!!route.app_guid));

    return actions;
  }

  render() {
    let content = <div></div>;

    if (this.props.route) {
      const route = this.props.route;
      const { domain_name, host, path } = this.props.route;
      const url = formatRoute(domain_name, host, path);

      if (route.editing) {
        content = (
          <RouteForm route={ route } domains={ DomainStore.getAll() }
            cancelHandler={ this._editHandler }
            submitHandler={ this._updateRoute }
          />
        );
      } else {
        content = (
          <div>
            <span className={this.styler('panel-column', 'panel-column-less')}>
              { url }</span>
            <PanelActions>
              { this.actions }
            </PanelActions>
          </div>
        );
      }
    }

    return content;
  }
}

Route.propTypes = propTypes;
Route.defaultProps = defaultProps;
