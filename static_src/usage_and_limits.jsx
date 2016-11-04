
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import Panel from './panel.jsx';

import AppStore from '../stores/app_store.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import UsageAndLimits from './usage_and_limits.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string,
  app: React.PropTypes.object
};

const defaultProps = {
  title: 'Default title',
  app: {}
};

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;

  return {
    currentAppGuid
  };
}

export default class AppSettingsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    return (
      <Panel title="Application settings">
        <UsageAndLimits app={ this.props.app }/>
      </Panel>
    );
  }
}

AppSettingsPanel.propTypes = propTypes;
AppSettingsPanel.defaultProps = defaultProps;
