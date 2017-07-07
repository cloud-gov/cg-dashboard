import 'cloudgov-style/css/base.css';
import './css/main.css';
// Icon used in cg-uaa.
import './img/dashboard-uaa-icon.jpg';
import 'cloudgov-style/img/favicon.ico';

import axios from 'axios';
import { Router } from 'director';

import { trackPageView } from './util/analytics.js';
import routes, { checkAuth, clearErrors, notFound } from './routes';

import RouterStore from './stores/router_store.js';
import MainContainer from './components/main_container.jsx';
import Loading from './components/loading.jsx';

const meta = document.querySelector('meta[name="gorilla.csrf.Token"]');

if (meta) {
  axios.defaults.headers.common['X-CSRF-Token'] = meta.content;
}

import React from 'react';
import ReactDOM from 'react-dom';

class RouteHandler extends React.Component {
  constructor() {
    super();

    this.state = {
      component: null
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    RouterStore.addChangeListener(this.onChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state === nextState ? false : true;
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

const cRouter = {
  run(routes, renderEl) {
    const router = new Router(routes);
    router.configure({
      async: true,
      before: [clearErrors, checkAuth],
      notfound: notFound,
      on: () => {
        trackPageView(window.location.hash);
      }
    });
    ReactDOM.render(
      <MainContainer>
        <RouteHandler />
      </MainContainer>, renderEl);

    router.init('/');
  }
};

cRouter.run(routes, document.querySelector('.js-app'));
