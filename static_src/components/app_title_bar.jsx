

import React from 'react';

import Action from './action.jsx';
import AppStore from '../stores/app_store.js';
import ErrorMessage from './error_message.jsx';
import Loading from './loading.jsx';
import appActions from '../actions/app_actions.js';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;
  const app = AppStore.get(currentAppGuid);

  return {
    app: app || {}
  };
}

export default class AppTitleBar extends React.Component {
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
    return <span>{ this.state.app.name }</span>;
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
      <span>
        <Action
          style="primary"
          clickHandler={ this._onRestart }
          label="restart app"
          disabled={ !AppStore.isRunning(this.state.app) }
          type="outline"
        >
          <span>Restart app</span>
        </Action>
        { error }
        { loading }
      </span>
    );
  }

  render() {
    return (
      <div className={ this.styler('header-view')}>
        <div className={ this.styler('usa-grid')}>
          <div className={ this.styler('title_bar')}>
          <h1>{ this.fullTitle }</h1> { this.statusUI } { this.restart }
          </div>
        </div>
      </div>
    );
  }
}

AppTitleBar.propTypes = { };
