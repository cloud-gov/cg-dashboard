
import React from 'react';

import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import DomainStore from '../stores/domain_store.js';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import Loading from './loading.jsx';
import RouteForm from './route_form.jsx';
import RouteStore from '../stores/route_store.js';
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

function stateSetter(props) {
  return {
    domains: DomainStore.getAll(),
    route: props.route
  };
}

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = stateSetter(props);

    this._deleteHandler = this._deleteHandler.bind(this);
    this._unbindHandler = this._unbindHandler.bind(this);
    this._bindHandler = this._bindHandler.bind(this);
    this._editHandler = this._editHandler.bind(this);
    this._updateHandler = this._updateHandler.bind(this);
    this._toggleRemove = this._toggleRemove.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    DomainStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(props) {
    this.setState(stateSetter(props));
  }

  componentWillUnmount() {
    DomainStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  _toggleRemove(ev) {
    ev.preventDefault();
    routeActions.toggleRemove(this.state.route.guid);
  }

  _deleteHandler(ev) {
    ev.preventDefault();
    routeActions.deleteRoute(this.state.route.guid);
  }

  _editHandler(ev) {
    ev.preventDefault();
    routeActions.toggleEdit(this.state.route.guid);
  }

  _bindHandler(ev) {
    ev.preventDefault();
    const route = this.state.route;
    routeActions.associateApp(route.guid, this.props.appGuid);
  }

  _unbindHandler(ev) {
    ev.preventDefault();
    const route = this.state.route;
    routeActions.unassociateApp(route.guid, route.app_guid);
  }

  _updateHandler(route) {
    const routeGuid = this.state.route.guid;
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
      <Action key="delete" label="Delete route" type="link" style="warning"
        clickHandler={this._toggleRemove}
      >
        Delete
      </Action>
    );
  }

  get editAction() {
    return (
      <Action key="edit" label="Edit route" type="link" style="primary"
        clickHandler={this._editHandler}
      >
        Edit
      </Action>
    );
  }

  bindAction(unbind) {
    return (
      <Action key="unbind" label={ (!!unbind) ? 'Unbind' : 'Bind' }
        style={ (!!unbind) ? 'warning' : 'primary' } type={ (!!unbind) ? 'link' : 'button' }
        clickHandler={ (!!unbind) ? this._toggleRemove : this._bindHandler }
      >
        { (!!unbind) ? 'Unbind' : 'Bind' }
      </Action>
    );
  }

  get actions() {
    const actions = [];
    const route = this.state.route;
    if (!route) return actions;

    if (route.loading) {
      return (
        <Loading
          text={ route.loading }
          loadingDelayMS={ 100 }
          style="inline"
        />
      );
    }

    if (!RouteStore.isRouteBoundToApp(route)) {
      actions.push(this.deleteAction);
    } else {
      actions.push(this.editAction);
    }
    actions.push(this.bindAction(RouteStore.isRouteBoundToApp(route)));

    return actions;
  }

  get confirmationMsg() {
    const { domain_name, host, path } = this.state.route;
    const url = formatRoute(domain_name, host, path);
    const displayUrl = <a href={ `//${url}` } title="See app route">{ url }</a>;
    return (RouteStore.isRouteBoundToApp(this.state.route)) ?
        <span>Unbind {displayUrl} route from this app?</span> :
        <span>Delete {displayUrl} route from this space?</span>;
  }

  get displayError() {
    const route = this.state.route;
    if (route.error) {
      return (
        <span>{ route.error.description }</span>
      );
    }
    return null;
  }

  render() {
    let content = <div></div>;

    if (this.state.route) {
      const route = this.state.route;
      const { domain_name, host, path } = this.state.route;
      const url = formatRoute(domain_name, host, path);

      if (route.editing) {
        content = (
          <RouteForm route={ route } domains={ this.state.domains }
            cancelHandler={ this._editHandler }
            submitHandler={ this._updateHandler }
          />
        );
      } else if (route.removing) {
        const currentAction = RouteStore.isRouteBoundToApp(route) ? 'unbind' :
          'delete';
        const confirmHandler = RouteStore.isRouteBoundToApp(route) ?
          this._unbindHandler : this._deleteHandler;
        content = (
          <div>
            <ConfirmationBox
              style="over"
              message={ this.confirmationMsg }
              confirmationText={ `Yes, ${currentAction}` }
              confirmHandler={ confirmHandler }
              cancelHandler={ this._toggleRemove }
            />
          </div>
        );
      } else {
        let displayUrl = <span>{ url }</span>;
        if (RouteStore.isRouteBoundToApp(route)) {
          displayUrl = (
            <a
              href={ `//${url}` }
              title="See app route"
              className={this.styler('route-link')}
            >{ url }</a>
          );
        }
        content = (
          <ElasticLine>
            <ElasticLineItem>
              { displayUrl }
            </ElasticLineItem>
            <ElasticLineItem align="end">
              { this.displayError }
            </ElasticLineItem>
            <ElasticLineItem align="end">
              { this.actions }
            </ElasticLineItem>
          </ElasticLine>
        );
      }
    }

    return content;
  }
}

Route.propTypes = propTypes;
Route.defaultProps = defaultProps;
