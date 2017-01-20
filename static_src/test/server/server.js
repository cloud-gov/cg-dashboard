
import hapi from 'hapi';
import inert from 'inert';
import smocks from 'smocks';

import authstatus from './authstatus';
import api from './api';

smocks.id('cg-dashboard-testing');

// add auth status route
authstatus(smocks);
// add all api routes
api(smocks);

// now start the server
const server = new hapi.Server();
server.connection({
  port: 8000,
  host: 'localhost'
});


// configure smocks as a hapi plugin
const smocksplugin = require('smocks/hapi').toPlugin();
smocksplugin.attributes = {
  pkg: require('../../../package.json')
};

server.register([
  inert,
  smocksplugin
]);

// serve static assets
server.route({
  method: 'get',
  path: '/{p*}',
  handler: {
    directory: {
      path: 'static'
    }
  }
});

server.start(function (err) {
  if (err) {
    throw err;
  }

  console.log( // eslint-disable-line no-console
    `Started smocks server on ${server.info.port}. Visit ${server.info.uri}/_admin to configure.`
  );
});
