# Dockerizing Notes


## Requirements

You will need to install:

- [PCFDev](https://docs.pivotal.io/pcf-dev/#installing)
- docker-compose

## Setup

### Start PCFDev

Run `./devtools/setup_local.sh`

It will start up PCFDev and then create the UAA clients for you.

## Running

To build the assets one-time:
``docker-compose run npm run build``

To start the system up, you can run:
`docker-compose up app -d`

You can navigate to two components:

1) The dashboard

Address: http://localhost:9999
This is what this repository contains.

By using PCF Dev, there are two users created automatically by default.

<!-- Put text about creds -->

2) The mailcatcher view

http://localhost:8025

Useful for debugging e-mails. There are invite flows that send e-mails. This UI
captures them.

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
