# Manual Development Workspace Setup Instructions

### Go backend
The Go backend isn't strictly required for all development. Consider [running locally with node](#run-locally-without-needing-go) if you will not be doing primary feature work where you need access to the actual Cloud Foundry API.

#### Cloning the repository
If you are unfamiliar with [`Go` project directory structure](https://golang.org/doc/code.html#Workspaces), you want the code in this repository to be in something like `<your-code-directory>/src/github.com/18f/cg-dashboard`. You can use that exact pattern by cloning the repository with:

```
git clone git@github.com:18F/cg-dashboard.git src/github.com/18F/cg-dashboard
```

#### Set the environment variables
If you are testing locally, export these variables. There is a sample file of environment variables called `env.sample`. Feel free to copy it and use the proper data. If you've never used environment variables before, you can run the following:
`mkdir ~/.env && cp ./env.sample ~/.env/cg-dashboard`

Then edit the file `~/.env/cg-dashboard` and provide the proper values. When you want to set all the environment variables, just run `source ~/.env/cg-dashboard`. You'll have to do this every time you open a new shell. If you work at 18F, ask a team member to send you the secret credentials.

- `GOPATH`: The absolute path to your code directory, one level up from the root of this project. If you followed the cloning instructions above, this path should correspond to the value you used for `<your-code-directory>`.
- `CONSOLE_CLIENT_ID`: Registered client id with UAA.
- `CONSOLE_CLIENT_SECRET`: The client secret.
- `CONSOLE_HOSTNAME`: The URL of the service itself.
- `CONSOLE_LOGIN_URL`: The base URL of the auth service. i.e. `https://login.domain.com`
- `CONSOLE_UAA_URL`: The URL of the UAA service. i.e. `https://uaa.domain.com`
- `CONSOLE_API_URL`: The URL of the API service. i.e. `http://api.domain.com`
- `CONSOLE_LOG_URL`: The URL of the loggregator service. i.e. `http://loggregator.domain.com`
- `PPROF_ENABLED`: <optional> If set to `true` or `1`, will turn on `/debug/pprof` endpoints as seen [here](https://golang.org/pkg/net/http/pprof/)


#### Codecheck

You need to have Docker installed and active within your environment as the
unit tests use Docker for short term real instances.

To run the go tests:

    $ ./codecheck.sh

`fmt` can be used to fix any linting errors:

    $ go fmt ./controllers


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
npm run watch-test-unit
```

To lint the code (also run as part of tests):
```
npm run lint
```

In order to get correct syntax highlighting with vim, install the following
npm modules globally:

```
npm install -g eslint
npm install -g babel-eslint
npm install -g eslint-plugin-react
```

## Running locally
- Make sure all of your environment variables are set and you are using the Go version as mentioned above.
- Install [dep](https://github.com/golang/dep)
- Run `dep ensure` to get all third party code
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

```sh
TEST_ROOT_PATH=`pwd` go test ./...
```

### Running Javascript unit tests

Test can then be run with the command:

```sh
npm run test
```

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
