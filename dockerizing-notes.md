# Dockerizing Notes

## Running

1. `docker-compose build`
1. `docker-compose run app npm install --no-shrinkwrap`
  because the shrinkwrap has darwin-specific packages listed

## Other stuff:

* Removed `host` property of `server.connection` config in `static_src/test/server/index.j`

## TODO:

* figure out what is needed for also developing `cg-style` (team usually uses `npm link`)
