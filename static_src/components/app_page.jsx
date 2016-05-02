
import React from 'react';

import AppStore from '../stores/app_store.js';

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      app: AppStore.get(this.state.currentAppGuid)
    });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}
