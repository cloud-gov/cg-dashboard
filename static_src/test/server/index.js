import hapi from "hapi";
import inert from "inert";
import smocks from "smocks";

import authstatus from "./authstatus";
import api from "./api";

// configure smocks as a hapi plugin
const smocksplugin = require("smocks/hapi").toPlugin();
const pkg = require("../../../package.json");

smocks.id("cg-dashboard-testing");

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
export default function start(...args) {
  const cb = args.pop();
  const port = args[0];

  const server = new hapi.Server();

  server.connection({
    port
  });

  smocksplugin.attributes = {
    pkg
  };

  server.register([inert, smocksplugin]);

  // serve static assets
  server.route({
    method: "get",
    path: "/assets/{p*}",
    handler: {
      directory: {
        path: "static/assets"
      }
    }
  });

  server.route({
    method: "get",
    path: "/skins/{p*}",
    handler: {
      directory: {
        path: "static/skins"
      }
    }
  });

  server.route({
    method: "get",
    path: "/{p*}",
    handler: {
      directory: {
        path: "templates/web"
      }
    }
  });

  // Default callback
  function __cb(err) {
    if (err) {
      throw err;
    }

    /* eslint-disable no-console */
    console.log(
      `Started smocks server on ${server.info.port}. Visit ${
        server.info.uri
      }/_admin to configure.`
    );
    /* eslint-enable no-console */
  }

  server.start(cb || __cb);

  return server;
}
