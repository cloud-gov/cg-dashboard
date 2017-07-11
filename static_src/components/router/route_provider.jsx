import React from 'react';
import RouterStore from '../../stores/router_store.js';
import Loading from '../loading.jsx';

class RouteProvider extends React.Component {
  constructor() {
    super();

    this.state = RouterStore.component;

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    RouterStore.addChangeListener(this.onChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state === nextState) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    RouterStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ ...RouterStore.component });
  }

  render() {
    const { component: Component, props } = this.state;
    return Component ? <Component { ...props } /> : <Loading />;
  }
}

export default RouteProvider;
