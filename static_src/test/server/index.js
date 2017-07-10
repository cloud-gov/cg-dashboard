
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

/*
 * Starts the server.
 *
 * @param port (optional) the system will choose a port automatically
 * @param cb (optional) callback to notify when server starts
 **/
export function start(...args) {
  const cb = args.pop();
  const port = args[0];

  const server = new hapi.Server();

  server.connection({
    port
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

  // Default callback
  function __cb(err) {
    if (err) {
      throw err;
    }

    console.log( // eslint-disable-line no-console
      `Started smocks server on ${server.info.port}. Visit ${server.info.uri}/_admin to configure.`
    );
  }

  server.start(cb || __cb);

  return server;
}
