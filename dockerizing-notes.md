# Dockerizing Notes

## Running

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
