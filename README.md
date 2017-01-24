# 18F Cloud Foundry Dashboard

[![CircleCI](https://circleci.com/gh/18F/cg-dashboard.svg?style=svg)](https://circleci.com/gh/18F/cg-dashboard)
[![Code Climate](https://codeclimate.com/github/18F/cg-dashboard/badges/gpa.svg)](https://codeclimate.com/github/18F/cg-dashboard)

Environments: [Production](https://dashboard.cloud.gov)
[Staging](https://dashboard-staging.apps.cloud.gov)
[Demo](https://dashboard-demo.apps.cloud.gov)


## Introduction

This dashboard is a web application to manage cloud.gov organizations, spaces, services, and apps.

Learn more about [cloud.gov](https://cloud.gov).

## Tech Stack

### Backend Server [![Go Code Coverage Status](https://coveralls.io/repos/18F/cg-dashboard/badge.svg?branch=master&service=github)](https://coveralls.io/github/18F/cg-dashboard?branch=master)
- `Go` (version 1.6.2)

### Front end application
- `Node` (version 6.x.x)
- `React` (version ^0.14.0)
- `Babel` (version ^6.x.x)
- `Karma` (version ^0.13.x)
- `Webpack` (version ^1.x.x)

## Setup
### Go backend
The Go backend isn't strictly required for all development. Consider [running locally with node](#run-locally-without-needing-go) if you will not be doing primary feature work where you need access to the actual Cloud Foundry API.

#### Cloning the repository
If you are unfamiliar with [`Go` project directory structure](https://golang.org/doc/code.html#Workspaces), you want the code in this repository to be in something like `<your-code-directory>/cg-dashboard-ws/src/github.com/18f/cg-dashboard`. You can use that exact pattern by cloning the repository with:

```
git clone git@github.com:18F/cg-dashboard.git cg-dashboard-ws/src/github.com/18F/cg-dashboard
```

#### Set the environment variables
If you are testing locally, export these variables. There is a sample file of environment variables called `env.sample`. Feel free to copy it and use the proper data. If you've never used environment variables before, you can run the following:
`mkdir ~/.env && cp ./env.sample ~/.env/cg-dashboard`

Then edit the file `~/.env/cg-dashboard` and provide the proper values. When you want to set all the environment variables, just run `source ~/.env/cg-dashboard`. You'll have to do this every time you open a new shell. If you work at 18F, ask a team member to send you the secret credentials.

- `GOPATH`: The absolute path to your project root. If you followed the cloning instructions above, this path should end with `cg-dashboard-ws`
- `CONSOLE_CLIENT_ID`: Registered client id with UAA.
- `CONSOLE_CLIENT_SECRET`: The client secret.
- `CONSOLE_HOSTNAME`: The URL of the service itself.
- `CONSOLE_LOGIN_URL`: The base URL of the auth service. i.e. `https://login.domain.com`
- `CONSOLE_UAA_URL`: The URL of the UAA service. i.e. `https://uaa.domain.com`
- `CONSOLE_API_URL`: The URL of the API service. i.e. `http://api.domain.com`
- `CONSOLE_LOG_URL`: The URL of the loggregator service. i.e. `http://loggregator.domain.com`
- `PPROF_ENABLED`: <optional> If set to `true` or `1`, will turn on `/debug/pprof` endpoints as seen [here](https://golang.org/pkg/net/http/pprof/)

### Front end
Front end build commands should be run in the same directory as the `package.json` file. If you've used the cloning command from this README it should be something like `/path/to/cg-dashboard-ws/src/github.com/18F/cg-dashboard`. Node version 6 and above should always be used.

Install front end dependencies (may require [special steps for node-gyp](https://github.com/nodejs/node-gyp#installation)):
```
npm install
```

Build the code:
```
npm run build
```
or to continually watch and build with changes:
```
npm run watch
```

To run the tests:
```
npm run test
```
or to continually watch for changes and run test suite:
```
npm run watch-test
```

To lint the code (also run as part of tests):
```
npm run lint
```

In order to get correct synatax highlighting with vim, install the following
npm modules globally:

```
npm install -g eslint
npm install -g babel-eslint
npm install -g eslint-plugin-react
```

## Running locally
- Make sure all of your environment variables are set and you are using the Go version as mentioned above.
- Install [glide](https://github.com/Masterminds/glide)
- Run `glide install` to get all third party code
- `go run server.go`
- Navigate browser to [`http://localhost:9999`](http://localhost:9999)

<a name="running_locally_without_needing_go"></a>
### Run locally without needing Go
This is an easy way to test out front end changes without needing to set up environment variables or `Go`. We will use a small server with fake data (used for automated testing) to get going quickly. If you want to see live data, you'll need to follow the instructions above.

The command `npm run testing-server` will run the server. We will still be using `npm run watch` to build the front end application when the file changes.

#### Start it
- `npm install` to get the Javascript dependencies
- `npm run testing-server & npm run watch` to start the server and build process

#### Stop it
Now when you're done, you'll want to stop the `testing-server` that is running in the background. You can find it by running `jobs`, and the line that looks like this:

`[N]  + running    npm run testing-server`

To kill that process, run `kill %N` where "N" is the number from the line.

## Unit Testing
### Running Go unit tests
- `go test $(glide nv)`

### Running Javascript unit tests
Test can then be run with the command:
```
npm run test
```

## Deploying

The cloud.gov dashboard is continuously deployed by CircleCI. To deploy manually:

### Bootstrap Deployment Spaces
In each space that you plan on deploying, you need to create a `user-provided-service`.

Run:
```
# For applications without New Relic monitoring
cf cups dashboard-ups -p '{"CONSOLE_CLIENT_ID":"your-client-id","CONSOLE_CLIENT_SECRET":"your-client-secret", "SESSION_KEY": "a-really-long-secure-value"}'

# For applications with New Relic monitoring
cf cups dashboard-ups -p '{"CONSOLE_CLIENT_ID":"your-client-id","CONSOLE_CLIENT_SECRET":"your-client-secret","CONSOLE_NEW_RELIC_LICENSE":"your-new-relic-license", "SESSION_KEY": "a-really-long-secure-value"}'
```

Create a redis service instance:

```bash
cf create-service redis28 standard dashboard-redis
```

### Create a Client with UAAC
- Make sure [UAAC](https://github.com/cloudfoundry/cf-uaac) is installed.
- Target your UAA server. `uaac target <uaa.your-domain.com>`
- Login with your current UAA account. `uaac token client get <your admin account> -s <your uaa admin password>`
- Create client account:
```
uaac client add <your-client-id> \
 --authorities uaa.none \
 --authorized_grant_types authorization_code,client_credentials,refresh_token \
 --scope cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
 --autoapprove true \
-s <your-client-secret>
```
- Unable to create an account still? Troubleshoot [here](https://docs.cloudfoundry.org/adminguide/uaa-user-management.html#creating-admin-users)


### CI
This project uses CircleCI
- The following environment variables need to be set in plain text in the global env section:
  - `CONSOLE_API_URL`, `CONSOLE_UAA_URL`, `CONSOLE_LOG_URL`, `CONSOLE_LOGIN_URL`, `CONSOLE_HOSTNAME="http://localhost:9999"`, `CONSOLE_TEST_ORG_NAME`, `CONSOLE_TEST_SPACE_NAME`, and `CONSOLE_TEST_APP_NAME`
- In case you fork this project for your own use (no need to do this if forking to make a pull request), you will need to use the CircleCI CLI UI to set the variables


## Functional Tests

Functional tests are our high-level automated UI tests that are run from the
browser. They can be slow to run, but often catch issues that only appear when
functional components appear together, like when running in a real web browser.

### Prerequisites

The tests are based on Webdriver and use the Selenium Standalone server to drive
the browsers.

- Java 8


### Setup

You'll only have to do this once. This downloads the browser-specific drivers
that we have configured.

    $ npm run test-selenium-install


### Run the tests

    $ npm run test-functional
