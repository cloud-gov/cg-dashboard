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

To start the system up, you can run:
`docker-compose up app frontend watch`

You can navigate to three components:

| Component        | Address           | Description  |
| ------------- |:-------------:| -----:|
| The Dashboard      | http://localhost:9999 | This is what this repository contains.<br/>By using PCF Dev, there are two users created automatically by default. <!-- TODO: Put text about creds -->|
| The mailcatcher view      | http://localhost:8025      |   Useful for debugging e-mails. There are invite flows that send e-mails. This UI captures them |
| HTML VNC Viewer | http://localhost:6901/?password=vncpassword      | Useful for seeing Javascript Karma Tests and Selenium Tests running.<br/>Based on [this](https://github.com/ConSol/docker-headless-vnc-container) container |


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
