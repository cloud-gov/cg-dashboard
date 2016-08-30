
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import PanelActions from './panel_actions.jsx';

import createStyler from '../util/create_styler';

import panelCss from '../css/panel.css';
import routeFormCss from '../css/route_form.css';

const propTypes = {
  domains: React.PropTypes.array.isRequired,
  route: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  handleCancel: React.PropTypes.func
};

const defaultProps = {
  route: {},
  handleSubmit: () => {},
  handleCancel: () => {}
};

export default class RouteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: props.route.domain,
      host: props.route.host,
      path: props.route.path
    };
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(style, panelCss, routeFormCss);
  }


  // TODO: If there are multiple route forms on the page, does it matter if
  // they all have elements with the same names? IDs are unique
  _onChange(ev) {
    const newValue = {};
    newValue[ev.target.name] = ev.target.value;
    this.setState(newValue);
  }

  get fullUrl() {
    let url = `${this.state.host}.${this.state.domain}`;
    if (this.state.path !== '') url += `/${this.state.path}`;
    return url;
  }

  get hasChanged() {
    let changed = false;

    if (this.state.host !== this.props.route.host) {
      changed = true;
    } else if (this.state.domain !== this.props.route.domain) {
      changed = true;
    } else if (this.state.path !== this.props.route.path) {
      changed = true;
    }

    return changed;
  }

  render() {
    const route = this.props.route;
    const domains = this.props.domains;

    return (
      <form className={ this.styler('route-form') }>
        <fieldset>
          <div className={ this.styler('route-fields') }>
            <div className={ this.styler('route-field-host') }>
              <label htmlFor={`${route.guid}-host`}>Hostname</label>
              <input type="text" id={`${route.guid}-host`}
                name="host" value={ this.state.host }
                onChange={ this._onChange }
              />
            </div>
            <div className={ this.styler('route-field-domain') }>
              <label htmlFor={`${route.guid}-domain`}>Domain</label>
              <select id={`${route.guid}-domain`} name="domain"
                onChange={ this._onChange }
              >
                { domains.map((domain) => {
                  let selected = (domain === this.state.domain);
                  return (
                    <option key={ domain } selected={ selected }>
                      { domain }
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={ this.styler('route-field-path') }>
              <label htmlFor={`${route.guid}-path`}>Path</label>
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
            value={ this.fullUrl }
          ></input>
        </div>
        <div className={ this.styler('route-form-actions') }>
          <PanelActions>
            <Action label="Delete route" style="outline">
              Delete route
            </Action>
          </PanelActions>
          <PanelActions>
            <Action onClickHandler={ this.props.handleCancel } label="Cancel"
                style="outline">
              Cancel
            </Action>
            <Action handleClick={ this.props.handleCancel } label="Apply"
              style="primary"
              disabled={ !this.hasChanged }
            >
              Apply
            </Action>
          </PanelActions>
        </div>
      </form>
    );
  }
}

RouteForm.propTypes = propTypes;
RouteForm.defaultProps = defaultProps;
