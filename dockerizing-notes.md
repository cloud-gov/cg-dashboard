# Dockerizing Notes


## Requirements

You will need to install:

- [PCFDev](https://docs.pivotal.io/pcf-dev/#installing)
- [docker-compose](https://docs.docker.com/compose/install/)

## Quick Start

For quick and low impact changes (e.g. typos, changes to **existing** styling),
you can use the frontend testing server. For all others changes,
use the [full setup guide](#full-setup).

```sh
# Start the 1) frontend service and 2) npm run watch service.
docker-compose up frontend watch -d
# Run the testing server.
docker-compose exec frontend bash -c "npm run testing-server"
```

You can navigate to `localhost:8001` and see the testing server.

## Full Setup

From the root of the repository:

```sh
# Start PCFDev and create the UAA client for you.
./devtools/setup_local.sh
# Start the app.
docker-compose up app frontend watch -d
```

You can navigate to three components:

| Component        | Address           | Description  |
| ------------- |:-------------:| -----:|
| The Dashboard      | http://localhost:9999 | This is what this repository contains.<br/>By using PCF Dev, there are two users created automatically by default. <!-- TODO: Put text about creds -->|
| The mailcatcher view      | http://localhost:8025      |   Useful for debugging e-mails. There are invite flows that send e-mails. This UI captures them |
| HTML VNC Viewer | http://localhost:6901/?password=vncpassword      | Useful for seeing Javascript Karma Tests and Selenium Tests running.<br/>Based on [this](https://github.com/ConSol/docker-headless-vnc-container) container |

## Tear Down

You can run: `docker-compose down` to tear down the services.

If you want to start fresh which removes containers and **volumes**, run `./devtools/clean.sh`. It also removes the vendored dependencies for Go (i.e. `vendor`) and Javascript (i.e. `node_modules`)


<!-- TODO Update this -->
You will first need to ensure that `../cg-style` exists relative
to your cg-dashboard checkout and contains a checkout of
[`cg-style`](https://github.com/18F/cg-style).

1. `docker-compose build`
1. `docker-compose run app ./setup-npm-link.sh`
1. Visit `localhost:8001` (or `app.cgdashboard.docker` if using `dinghy`)

## Other stuff:

* Removed `host` property of `server.connection` config in `static_src/test/server/index.js`

## TODO:

* add a test verifying that `.nvmrc` specifies the same node version
  as the `Dockerfile`.
