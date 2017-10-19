import 'cloudgov-style/css/base.css';
import 'cloudgov-style/css/cloudgov-style.css';
import './css/main.css';
import './css/overrides.css';
// Icon used in cg-uaa.
import './img/dashboard-uaa-icon.jpg';

import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { Router } from 'director';

import { trackPageView } from './util/analytics.js';
import routes, { checkAuth, clearErrors, notFound } from './routes';

import MainContainer from './components/main_container.jsx';
import RouteProvider from './components/router/route_provider.jsx';

const initCSRFHeader = metaTag => {
  if (metaTag) {
    axios.defaults.headers.common['X-CSRF-Token'] = metaTag.content;
  }
};

const cRouter = {
  run(routeConfig, renderEl) {
    const router = new Router(routeConfig);
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
        <RouteProvider />
      </MainContainer>, renderEl);

    router.init('/');
  }
};

initCSRFHeader(document.querySelector('meta[name="gorilla.csrf.Token"]'));

cRouter.run(routes, document.getElementById('root'));
