
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import PanelActions from './panel_actions.jsx';

import createStyler from '../util/create_styler';
import formatRoute from '../util/format_route';

import routeFormCss from '../css/route_form.css';

const propTypes = {
  domains: React.PropTypes.array.isRequired,
  route: React.PropTypes.object,
  submitHandler: React.PropTypes.func,
  cancelHandler: React.PropTypes.func,
  deleteHandler: React.PropTypes.func
};

const defaultProps = {
  route: {},
  submitHandler: () => {},
  cancelHandler: () => {}
};

export default class RouteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domain_name: props.route.domain_name,
      domain_guid: props.route.domain_guid, // snake_case since it's an api arg
      guid: props.route.guid,
      host: props.route.host,
      path: props.route.path
    };
    this._onChange = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.styler = createStyler(style, routeFormCss);
  }


  // TODO: If there are multiple route forms on the page, does it matter if
  // they all have elements with the same names? IDs are unique
  _onChange(event) {
    const newValue = {};
    newValue[event.target.name] = event.target.value;

    if (event.target.name === 'domain_guid') {
      newValue.domain_name = this.props.domains.find((domain) => {
        return domain.guid === event.target.value;
      }).name;
    }

    this.setState(newValue);
  }

  _onSubmit(event) {
    event.preventDefault();
    const payload = {};
    Object.keys(this.state).forEach((key) => {
      let value = this.state[key];
      // path needs to start with a / per the cf api docs
      if (key === 'path' && value[0] !== '/' && value !== '') {
        value = `/${value}`;
      }
      payload[key] = value;
    });
    this.props.submitHandler(payload);
  }

  get fullUrl() {
    const { domain_name, host, path } = this.state;
    return formatRoute(domain_name, host, path);
  }

  get hasChanged() {
    let changed = false;

    if (this.state.host !== this.props.route.host) {
      changed = true;
    } else if (this.state.domain_guid !== this.props.route.domain_guid) {
      changed = true;
    } else if (this.state.path !== this.props.route.path) {
      changed = true;
    }

    return changed;
  }

  get deleteAction() {
    if (!this.props.deleteHandler) return null;
    return (
      <Action clickHandler={ this.props.deleteHandler } label="Delete route"
        type="link" style="cautious"
      >
        Delete route
      </Action>
    );
  }

  // If there is a delete handler, this form is for editing a route
  // Otherwise, it is for a new route
  // The submit action label should be adjusted accordingly
  get submitActionText() {
    if (this.props.deleteHandler) return 'Apply';
    return 'Add route';
  }

  render() {
    const route = this.props.route;
    const domains = this.props.domains;

    return (
      <form className={ this.styler('route-form') }>
        <fieldset>
          <div className={ this.styler('route-fields') }>
            <div className={ this.styler('route-field-host') }>
              <label htmlFor={`${route.guid}-host`}>Host</label>
              <input type="text" id={`${route.guid}-host`}
                name="host" value={ this.state.host }
                onChange={ this._onChange }
              />
            </div>
            <div className={ this.styler('route-field-domain') }>
              <label htmlFor={`${route.guid}-domain`}>Domain</label>
              <select id={`${route.guid}-domain`} name="domain_guid"
                onChange={ this._onChange }
                value={ this.props.route.domain_guid }
              >
                <option key="none">---</option>
                { domains.map((domain) => {
                  return (
                    <option key={ domain.guid } value={ domain.guid } >
                      { domain.name }
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={ this.styler('route-field-path') }>
              <label htmlFor={`${route.guid}-path`}>Path (optional)</label>
              <input type="text" id={`${route.guid}-path`}
                name="path" value={ this.state.path }
                onChange={ this._onChange }
              />
            </div>
          </div>
        </fieldset>
        <div>
          <label htmlFor="route-preview">Route preview</label>
          <input type="text" readOnly id="route-preview"
            className={ this.styler('route-form-preview') }
            value={ this.fullUrl }
          ></input>
        </div>
        <div className={ this.styler('route-form-actions') }>
          <PanelActions>
            { this.deleteAction }
          </PanelActions>
          <PanelActions>
            <Action clickHandler={ this.props.cancelHandler } label="Cancel"
              style="outline"
            >
              Cancel
            </Action>
            <Action clickHandler={ this._onSubmit }
              label={ this.submitActionText } style="primary"
              disabled={ !this.hasChanged }
            >
              { this.submitActionText }
            </Action>
          </PanelActions>
        </div>
      </form>
    );
  }
}

RouteForm.propTypes = propTypes;
RouteForm.defaultProps = defaultProps;
