
import React from 'react';

import Action from './action.jsx';
import PanelActions from './panel_actions.jsx';
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
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  _deleteHandler(ev) {
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
    ev.preventDefault();
    const route = this.props.route;
    routeActions.unassociateApp(route.guid, route.app_guid);
  }

  _updateRoute(routeGuid, route) {
    // TODO fix
    const domainGuid = route.domain_guid;
    const spaceGuid = this.state.spaceGuid;
    let path = route.path;
    if (route.path && (route.path[0] !== '/')) {
      path = `/${route.path}`;
    }
    const updatedRoute = Object.assign({}, route, { path });
    routeActions.updateRoute(routeGuid, domainGuid, spaceGuid, updatedRoute);
  }

  get deleteAction() {
    return (
      <Action label="Delete route" type="link" style="cautious"
        clickHandler={this._deleteHandler}
      >
        Delete
      </Action>
    );
  }

  get editAction() {
    return (
      <Action label="Edit route" type="button" style="outline"
        clickHandler={this._editHandler}
      >
        Edit
      </Action>
    );
  }

  bindAction(unbind) {
    return (
      <Action label={ (!!unbind) ? 'Unbind' : 'Bind' } style="outline"
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

    if (!route.app_guid) {
      actions.push(this.deleteAction);
    }
    actions.push(this.editAction);
    actions.push(this.bindAction(!!route.app_guid));

    return actions;
  }

  render() {
    let content = <div></div>;

    if (this.props.route) {
      const { domain_name, host, path } = this.props.route;
      const url = formatRoute(domain_name, host, path);
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

    return content;
  }
}

Route.propTypes = propTypes;
Route.defaultProps = defaultProps;
