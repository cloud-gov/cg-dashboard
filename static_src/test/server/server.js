var path = require('path');

var hapi = require('hapi');
var inert = require('inert');
var smocks = require('smocks');

var authstatus = require('./authstatus');
var api = require('./api');

smocks.id('cg-dashboard-testing');

// add auth status route
authstatus(smocks);
// add all api routes
api(smocks);

// now start the server
var server = new hapi.Server();
server.connection({
  port: 8000,
  host: 'localhost'
});


// configure smocks as a hapi plugin
var smocksplugin = require('smocks/hapi').toPlugin();
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

  console.log('started smocks server on ' + server.info.port + '.  visit ' + server.info.uri + '/_admin to configure');
});
