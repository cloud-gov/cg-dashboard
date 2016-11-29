

import React from 'react';

import Action from './action.jsx';
import AppStore from '../stores/app_store.js';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;
  const app = AppStore.get(currentAppGuid);

  return {
    app: app || {}
  };
}

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this._onRestart = this._onRestart.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _onRestart() {
    appActions.restart(this.state.app.guid);
  }

  get fullTitle() {
    let content = <span><strong>{ this.state.app.name }</strong> application</span>
    if (this.state.currentSpaceName && this.state.currentOrgName) {
      content = <span><strong>{ this.state.app.name }</strong> application in your <strong>{ this.state.currentSpaceName }</strong> space, which is in your <strong>{ this.state.currentOrgName }</strong> organization</span>;
    }
    return content;
  }

  get statusUI() {
    return (
      <span className={ this.styler('usa-label') }>{ this.state.app.state }</span>
    );
  }

  get restart() {
    let loading;
    let error;

    if (AppStore.isRestarting(this.state.app)) {
      loading = <Loading text="Restarting app" style="inline" />;
    }
    if (this.state.app.error) {
      error = (
        <ErrorMessage err={ this.state.app.error } />
      );
    }

    return (
      <div>
        <Action
          style="primary"
          clickHandler={ this._onRestart }
          label="restart app"
          disabled={ !AppStore.isRunning(this.state.app) }
          type="outline">
          <span>Restart app</span>
        </Action>
        { error }
        { loading }
      </div>
    );
  }

  render() {
    let content;

    return (
      <div>
        <h1>Hello</h1>
      </div>
    );
  }
}

AppContainer.propTypes = { };
