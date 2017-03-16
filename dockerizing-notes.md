# Dockerizing Notes

- `nvm` is run when the container starts (via `docker-entrypoint.sh`) and will
  use the project's `.nvmrc` file to determine which node version to install
  and use.
- Fixed the issue with `npm install` that respects `npm-shrinkwrap.json`. the
  problem was not being able to build the same fsevents due to not having
  python in the container.

## Running

1. `docker-compose build`
1. `docker-compose run app npm install`
1. Visit `localhost:8001` (or `app.cgdashboard.docker` if using `dinghy`)

## Other stuff:

* Removed `host` property of `server.connection` config in `static_src/test/server/index.js`

## TODO:

* figure out what is needed for also developing `cg-style` (team usually uses `npm link`)
* figure out why the shrinkwrap doesn't work -- looks like it has to do
  with fsevents not building due to missing python in the container
