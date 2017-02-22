
// This testing server acts as a "sidecar" for a main process given as command
// line arguments, or simply starts the testing server.
//
// Sidecar pattern comes from Netflix's Prana[1] but instead of providing
// platform services, we just provide access to the testing server.
//
// TODO the testing server does not require any cleanup nothing is done to stop
// the server. Connections are cleaned up as part of the process.exit
//
// [1] http://techblog.netflix.com/2014/11/prana-sidecar-for-your-netflix-paas.html

var child_process = require('child_process');

require('babel-register');

var start = require( './index').start;

var port = process.env.PORT;

function spawnChildCb(command, args) {
  function __cb(err) {
    if (err) {
      throw err;
    }

    console.log(`Started smocks server on ${server.info.port}. Visit ${server.info.uri}/_admin to configure.`);

    if (!command) {
      // No arguments passed, just leave the test server running for manual testing
      return;
    }

    // Kick off the main process
    var main = child_process.spawn(command, args, {
      stdio: 'inherit',
      env: Object.assign({}, process.env, {
        PORT: server.info.port
      })
    });

    // Make sure to exit with the main's code
    main.on('close', function (exitCode) {
      process.exit(exitCode);
    });

    function connectSignal(signal) {
      process.on(signal, function () { main.kill(signal); });
    }

    // Forward signals to main
    connectSignal('SIGINT');
    connectSignal('SIGTERM');
  }

  return __cb;
}


var args = process.argv.slice(2); // Drop the first to arguments (node path and exec path)
var command = args.shift();
var server = start(port, spawnChildCb(command, args));
