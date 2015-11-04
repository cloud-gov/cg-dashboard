# 18F Cloud Foundry Deck

[![Build Status](https://travis-ci.org/18F/cg-deck.svg?branch=master)](https://travis-ci.org/18F/cg-deck)


## Tech Stack
- `Go` (v1.5 required) for the backend server. [![Go Code Coverage Status](https://coveralls.io/repos/18F/cg-deck/badge.svg?branch=master&service=github)](https://coveralls.io/github/18F/cg-deck?branch=master)

- `AngularJS` for the frontend. [![JS Code Coverage Status](http://codecov.io/github/18F/cg-deck/coverage.svg?branch=master)](http://codecov.io/github/18F/cg-deck?branch=master)


## Setup
### Create a Client with UAAC
- Make sure [UAAC](https://github.com/cloudfoundry/cf-uaac) is installed.
- Target your UAA server. `uaac target <uaa.your-domain.com>`
- Login with your current UAA account. `uaac token client get <your admin account> -s <your uaa admin password>`
- Create client account:
```
uaac client add <your-client-id> \
 --authorities cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
 --authorized_grant_types authorization_code,client_credentials,refresh_token \
 --scope cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
-s <your-client-secret>
```
- Unable to create an account still? Troubleshoot [here](https://docs.cloudfoundry.org/adminguide/uaa-user-management.html#creating-admin-users)

### Set the environment variables
If you are testing locally, export these variables. If you are deploying to cloud foundry, modify the manifest.yml
- `CONSOLE_CLIENT_ID`: Registered client id with UAA.
- `CONSOLE_CLIENT_SECRET`: The client secret.
- `CONSOLE_HOSTNAME`: The URL of the service itself.
- `CONSOLE_LOGIN_URL`: The base URL of the auth service. i.e. `https://login.domain.com`
- `CONSOLE_UAA_URL`: The URL of the UAA service. i.e. `https://uaa.domain.com`
- `CONSOLE_API_URL`: The URL of the API service. i.e. `http://api.domain.com`
- `CONSOLE_LOG_URL`: The URL of the loggregator service. i.e. `http://loggregator.domain.com`
- `PPROF_ENABLED`: An optional variable. If set to `true` or `1`, will turn on `/debug/pprof` endpoints as seen [here](https://golang.org/pkg/net/http/pprof/)

## Front end
Install front end dependencies
```
npm install
```
## Running locally
- Make sure all of your environment variables are set as mentioned above.
- Install [godep](https://github.com/tools/godep)
- Run `godep restore` to get all third party code
- `go run server.go`
- Navigate browser to `http://localhost:9999`

## Unit Testing
### Running Go unit tests
- `go test ./...`

### Running Angular unit tests
Test can then be run with the command:
```
npm run tests
```
To get a viewable coverage report change the `coverageReport` object in `karma.conf.js` from `json` to `html`
```
coverageReporter: {
    type: 'html',
    dir: 'coverage',
    subdir: '.'
}
```

### Acceptance Tests
This project currently uses a combination of [Agouti](http://agouti.org/) + [Ginkgo](http://onsi.github.io/ginkgo/) + [Gomega](http://onsi.github.io/gomega/) to provide BDD acceptance testing.
All the acceptance tests are in the 'acceptance' folder.


#### Setup
- Make sure you have PhantomJS installed: `brew install phantomjs`
- Install aogut: `go get github.com/sclevine/agouti`
- Install ginkgo `go get github.com/onsi/ginkgo/ginkgo`
- Install gomega `go get github.com/onsi/gomega`
- To run locally, in addition to the variables in the "Set the environmnent variables" section, you will need to set two more variables in your environment
- `CONSOLE_TEST_USERNAME`: The username of the account you want the tests to use to login into your `CONSOLE_LOGIN_URL`
- `CONSOLE_TEST_PASSWORD`: The password of the account you want the tests to use to login into your `CONSOLE_LOGIN_URL`
- `CONSOLE_TEST_ORG_NAME`: The test organization the user should be navigating to.
- `CONSOLE_TEST_SPACE_NAME`: The test space the user should be navigating to.
- `CONSOLE_TEST_APP_NAME`: The test app the user should be navigating to.
- `CONSOLE_TEST_HOST`: The host that the app can create a mock route for.
- `CONSOLE_TEST_DOMAIN`: The domain for the mock route.

#### Running acceptance tests
- `cd acceptance && go test -tags acceptance`

## Deploying
- `cf push <optional-app-name>`

## CI
This project uses Travis-CI
- The following environment variables need to be set in plain text in the global env section:
  - `CONSOLE_API_URL`, `CONSOLE_UAA_URL`, `CONSOLE_LOG_URL`, `CONSOLE_LOGIN_URL`, `CONSOLE_HOSTNAME="http://localhost:9999"`, `CONSOLE_TEST_ORG_NAME`, `CONSOLE_TEST_SPACE_NAME`, and `CONSOLE_TEST_APP_NAME`
- In case you fork this project for your own use (no need to do this if forking to make a pull request), you will need to use the Travis-CI CLI tool to re-encrypt all the environment variables.
  - `travis encrypt CONSOLE_CLIENT_ID='<your client id>' --add env.global`
  - `travis encrypt CONSOLE_CLIENT_SECRET='<your client secret>' --add env.global`
  - `travis encrypt CONSOLE_TEST_PASSWORD='<the test user account password>' --add env.global`
  - `travis encrypt CONSOLE_TEST_USERNAME='<the test user account username>' --add env.global`
  - `travis encrypt CF_USERNAME='<the user account username used to deploy>' --add env.global`
  - `travis encrypt CF_PASSWORD='<the user account password used to deploy>' --add env.global`

## What’s a Deck?

From [Wikipedia](https://en.wikipedia.org/wiki/Sprawl_trilogy#Glossary):

The Sprawl trilogy (also known as the Neuromancer, Cyberspace, or Matrix trilogy) is William Gibson's first set of novels, composed of Neuromancer (1984), Count Zero (1986), and Mona Lisa Overdrive (1988).

**Cyberspace Deck**

Also called a "deck" for short, it is used to access the virtual representation of the matrix. The deck is connected to a tiara-like device that operates by using electrodes to stimulate the user's brain while drowning out other external stimulation. As Case describes them, decks are basically simplified simstim units.
