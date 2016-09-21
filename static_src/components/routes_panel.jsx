
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import AppStore from '../stores/app_store.js';
import Action from './action.jsx';
import DomainStore from '../stores/domain_store.js';
import OrgStore from '../stores/org_store.js';
import Panel from './panel.jsx';
import PanelActions from './panel_actions.jsx';
import PanelGroup from './panel_group.jsx';
import PanelHeader from './panel_header.jsx';
import PanelRow from './panel_row.jsx';
import routeActions from '../actions/route_actions.js';
import Route from './route.jsx';
import RouteForm from './route_form.jsx';
import RouteStore from '../stores/route_store.js';
import QuotaStore from '../stores/quota_store.js';
import SpaceStore from '../stores/space_store.js';

import createStyler from '../util/create_styler';

function stateSetter() {
  const appGuid = AppStore.currentAppGuid;
  const orgGuid = OrgStore.currentOrgGuid;
  const spaceGuid = SpaceStore.currentSpaceGuid;

  const currentOrg = OrgStore.get(OrgStore.currentOrgGuid);
  const currentSpace = SpaceStore.get(SpaceStore.currentSpaceGuid);
  const orgQuotaGuid = (currentOrg) ? currentOrg.quota_definition_guid : null;
  const spaceQuotaGuid = (currentSpace) ? currentSpace.space_quota_definition_guid : null;

  const routes = RouteStore.getAllForSpace(spaceGuid).map((route) => {
    let newRoute = Object.assign({}, route);
    const domain = DomainStore.get(route.domain_guid);
    if (domain) {
      newRoute = Object.assign({}, newRoute, { domain_name: domain.name});
    }
    if (route.path && (route.path[0] === '/')) {
      newRoute.path = route.path.replace('/', '');
    }
    return newRoute;
  });

  const boundRoutes = routes.filter((route) => route.app_guid === appGuid);
  const unboundRoutes = routes.filter((route) => !route.app_guid);

  return {
    appGuid,
    orgGuid,
    spaceGuid,
    orgName: OrgStore.currentOrgName,
    spaceName: SpaceStore.currentSpaceName,
    orgQuota: QuotaStore.get(orgQuotaGuid),
    spaceQuota: QuotaStore.get(spaceQuotaGuid),
    boundRoutes,
    unboundRoutes,
    showCreateForm: RouteStore.showCreateRouteForm,
    error: RouteStore.error
  };
}

export default class RoutesPanel extends React.Component {
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
    QuotaStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    DomainStore.removeChangeListener(this._onChange);
    QuotaStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _addCreateRouteForm(event) {
    if (event) event.preventDefault();
    routeActions.showCreateForm();
  }

  _removeCreateRouteForm(ev) {
    if (ev) ev.preventDefault();
    routeActions.hideCreateForm();
  }

  _createRouteAndAssociate(route) {
    const { appGuid, spaceGuid } = this.state;
    const domainGuid = route.domain_guid;
    routeActions.createRouteAndAssociate(appGuid, domainGuid, spaceGuid, route);
  }

  get addRouteAction() {
    if (this.state.showCreateForm) return null;
    return (
      <Action clickHandler={ this._addCreateRouteForm }
        label="Create a new route for this app" type="outline"
      >
        Create a new route for this app
      </Action>
    );
  }

  get createRouteForm() {
    if (!this.state.showCreateForm) return null;

    let routeTotal = -1;
    if (this.state.spaceQuota) {
      routeTotal = this.state.spaceQuota.total_routes;
    } else if (this.state.orgQuota) {
      routeTotal = this.state.orgQuota.total_routes;
    }
    const routeLimit = routeTotal - (this.state.boundRoutes.length +
                                     this.state.unboundRoutes.length);
    return (
      <RouteForm domains={ DomainStore.getAll() }
        routeLimit={ routeLimit }
        error={ this.state.error }
        cancelHandler={ () => this._removeCreateRouteForm() }
        submitHandler={ this._createRouteAndAssociate }
      />
    );
  }

  get spaceLink() {
    return (
      <a href={ `/#/org/${this.state.orgGuid}/spaces/${this.state.spaceGuid}` }>
        { this.state.spaceName }
      </a>
    );
  }

  renderRoutes(routes) {
    let content = <PanelRow><h4>No routes</h4></PanelRow>;

    if (routes && routes.length) {
      content = routes.map((route) =>
        <PanelRow key={ route.guid + route.app_guid }>
          <Route route={ route } appGuid={ this.state.appGuid} />
        </PanelRow>
      );
    }
    return content;
  }

  render() {

    return (
      <Panel title="Routes">
        <PanelGroup>
          <PanelHeader>
            <h3>Bound routes</h3>
          </PanelHeader>
          { this.renderRoutes(this.state.boundRoutes) }
        </PanelGroup>
        <PanelGroup>
          <PanelHeader>
            <h3>Routes available in {this.spaceLink}</h3>
          </PanelHeader>
          { this.renderRoutes(this.state.unboundRoutes) }
        </PanelGroup>
        { this.createRouteForm }
        <PanelGroup>
        <PanelActions>
          { this.addRouteAction }
        </PanelActions>
        </PanelGroup>
      </Panel>
    );
  }
}

RoutesPanel.propTypes = {};

RoutesPanel.defaultProps = {};
