# Dockerizing Notes

## Table of Contents

- [Quick-Start](#quick-start)
  - [Requirements](#quick-start-requirements)
  - [Running](#quick-start-running)
- [Full Setup](#full-setup)
  - [Requirements](#full-setup-requirements)
  - [Running](#full-setup-running)
  - [Running One-Offs](#full-setup-running-one-offs)
    - [Frontend One-Offs](#frontend-one-offs)
    - [Backend One-Offs](#backend-one-offs)
    - [UAA One-Offs](#uaa-one-offs)
    - [CF One-Offs](#cf-one-offs)
- [Tear Down](#tear-down)
- [Side Effects](#side-effects)

## Quick Start

For quick and low impact changes (e.g. typos, changes to **existing** styling)
or for a quick glance at the dashboard, you can follow this quick start
section to start the frontend testing server.
For all others changes, use the [full setup guide](#full-setup).

### Quick-Start: Requirements

- [docker-compose](https://docs.docker.com/compose/install/)

### Quick-Start: Running

```sh
docker-compose up frontend_testing_server
```

It will say the server is up when everything is done. At the point, you can
navigate to `http://localhost:8001` and see the testing server.

## Full Setup

After running the Full Setup instructions, you will have a
local cloud foundry deployment (with UAA), the dashboard, a redis service
instance, mailcatcher for testing e-mails, and npm watch running so that you can
automatically recompile your frontend changes.

### Full Setup: Requirements

You will need to install:

- [PCFDev](https://docs.pivotal.io/pcf-dev/#installing)
- [docker-compose](https://docs.docker.com/compose/install/)

### Full Setup: Running

*Recommendation: You should open two terminals to the root of this repository
so you can run the "[Optional]" commands below so you can view more information
about the containers as they start up since it does take awhile.*

From the root of the repository:

```sh
# Start PCFDev.
# Will take a long time and your computer fans will spin up but afterwards
# your system will return to normal.
cf dev start -s none
# Run "cf dev start" on all subsequent runs. You can't pass configuration flags
# to an existing PCFDev deployment.
# You can only pass configuration flags on first creation.

# Create the UAA client "dashboard-local" with appropriate permissions.
# Will also delete the old one (if one exists), in case you want to try new permissions.
docker run governmentpaas/cf-uaac \
  /bin/sh -c '
  uaac target https://uaa.local.pcfdev.io --skip-ssl-validation && \
  uaac token client get admin -s "admin-client-secret" && \
  uaac client delete dashboard-local; \
  uaac client add dashboard-local \
    --scope="cloud_controller.admin cloud_controller.read cloud_controller.write openid scim.read scim.invite" \
    --redirect_uri="http://localhost:8002/oauth2callback" \
    --authorities="uaa.none scim.invite cloud_controller.admin scim.read" \
    --authorized_grant_types "authorization_code client_credentials refresh_token" -s "notarealsecret"'

# Start the app. Will also take a long time
# (but not as long as the first command)
docker-compose up -d app frontend watch

# [Optional] In the second terminal, you can tail
# the logs of the containers
docker-compose logs -f
```

You can navigate to three components:

| Component        | Address           | Description  |
| ------------- |:-------------:| ----- |
| The Dashboard      | http://localhost:8002 | This is what this repository contains.<br/>By using PCF Dev, there are two users created automatically by default.<br/>Admin User: `admin`:`admin`<br/> Regular User: `user`:`pass`<br/><br/><h5>SSL Note</h5>When you login, you will need to skip the security SSL warning / add exception in your browser since we do not have a valid certificate for *local.pcfdev.io.|
| The mailcatcher view      | http://localhost:8025      |   Useful for debugging e-mails. There are invite flows that send e-mails. This UI captures them |
| HTML VNC Viewer | http://localhost:6901/?password=vncpassword      | Useful for seeing Javascript Karma Tests and Selenium Tests running.<br/>Based on [this](https://github.com/ConSol/docker-headless-vnc-container) container |

_Note: the credentials here are not sensitive since they are
only used with the local deployment and the credentials are public knowledge.
[\[1\]](https://github.com/pivotal-cf/pcfdev)
[\[2\]](https://github.com/ConSol/docker-headless-vnc-container)_

#### Working with cg-style

In the event that you need to modify the styling of cg-dashboard, it will most
likely occur in the `cg-style` repo. You can see your changes in real time by
linking and watching for the changes there.

```sh
export CG_STYLE_PATH=/path/to/cg-style/repo/here
docker-compose up -d watch_cg_style
# If you're tailing the logs, you will see the `frontend` service will restart

# add the link first to cg-style (ignore the initial errors)
docker-compose exec watch bash -c "cd /cg-style && npm link && \
  cd /cg-dashboard && npm link cloudgov-style && npm install"

# restart the watch service
docker-compose restart watch
# after the service comes up successfully, your local changes to cg-style will
# automatically build in the watch_cg_style service then will you will see the
# watch service automatically rebuild.
```

##### Unlink local cg-style

In the event that you want to unlink the service, just unlink and restart watch.

```sh
docker-compose exec watch bash -c "npm unlink cloudgov-style && npm install"
docker-compose restart watch
```

#### Recompile the Backend

The frontend will automatically recompile upon changing the source.
That is not the case for the backend. Unforunately, the Go watchers
tried caused the CPU to spike up very high.

In order to recompile, just run:

```sh
docker-compose stop app
docker-compose up -d app
```

It will replace the existing app container with a new one, thus recompiling the backend.

### Full Setup: Running One-Offs

Running one-offs is especially important if you don't have the proper tools
(such as [Go](https://golang.org/), [node](https://nodejs.org/en/),
[cf cli](https://github.com/cloudfoundry/cli), or
[uaac](https://github.com/cloudfoundry/cf-uaac)) installed on your computer.
With Docker, you can use the appropriate executable in a container.

#### Frontend One-Offs

Format: `docker-compose run --rm frontend <COMMAND>`

Examples
- Add dependency: `docker-compose run --rm frontend npm install <dep> --save`
- Frontend unit tests: `docker-compose run --rm frontend npm run test-unit`
- Watch test suite: `docker-compose run --rm frontend npm run watch-test`
- Frontend functional tests (w/o visual debugging):
`docker-compose run --rm frontend npm run test-functional`

For more possible commands, refer to the package.json.

##### Visual Debugging
Once the `frontend` service is up and running (via
`docker-compose up -d frontend`), you can use the docker-compose `exec` command
to attach to the existing container. While viewing the container via the HTML
VNC Viewer (refer to the table above), you will see the container's Chrome
browser open and execute the commands.

Format: `docker-compose exec frontend bash -c "<COMMAND>"`

Examples:
- Frontend functional tests: `docker-compose exec frontend bash -c "npm run test-functional"`

##### Updating the node version.

Currently, we need to append to the PATH at container build time, so that
node and npm are in the PATH at container runtime. Change the `NODE_VERSION` in
the Dockerfile in the `devtools/node` directory. Then rebuild the image with:
`docker-compose build frontend_dev_tools`

#### Backend One-Offs

Format: `docker-compose run --rm backend <COMMAND>`

Examples:
- Add dependency: `docker-compose run --rm backend glide get github.com/some/repo`
- Run `./codecheck.sh`: `docker-compose run --rm backend ./codecheck.sh`

#### UAA One-Offs

If you are trying to modify your local UAA, you can use a Docker Image and
use a multi-command which first logs in then runs your desired command.

Example:
```sh
docker run governmentpaas/cf-uaac \
  /bin/sh -c '
  uaac target https://uaa.local.pcfdev.io --skip-ssl-validation && \
  uaac token client get admin -s "admin-client-secret" && \
  <MORE UAA COMMAND(S)>'
```

For an example, look at the `uaac` command in the [Full Setup: Running section](#full-setup-running).

_Note: the credentials here are not sensitive since they are
only used with PCFDEV (which is local and also the credentials are
public knowledge in the [PCFDEV](https://github.com/pivotal-cf/pcfdev) repo)._

#### CF One-Offs

Similar to the UAA One-Offs section, you can use a docker image with the CF CLI.

Example:
```
docker run governmentpaas/cf-cli \
  /bin/sh -c '
  cf login -a https://api.local.pcfdev.io --skip-ssl-validation -u admin -p admin && \
  <MORE CF COMMAND(S)>'
```

Also, you could use your local CF CLI. (which you will likely have already.)

_Note: the credentials here are not sensitive since they are
only used with PCFDEV (which is local and also the credentials are
public knowledge in the [PCFDEV](https://github.com/pivotal-cf/pcfdev) repo)._

## Tear Down

You can run: `docker-compose down` to tear down the services.

If you want to start fresh which removes ALL containers and **volumes**
(even those **not** related to the project), run `./devtools/clean.sh`.
It also removes the dependencies for Go (i.e. `vendor/`) and
Javascript (i.e. `node_modules/`).

If you want to suspend PCFDev (keep all the data), run: `cf dev suspend`

If you want to destroy your PCDev deployment, run: `cf dev destroy`

## Side Effects

### Extra Files From Containers
In the case that there are extra files created, you should modify
`devtools/node/cleanup.js` so that there's a watcher that removes those files.
