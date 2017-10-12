# 18F Cloud Foundry Dashboard

[![CircleCI](https://circleci.com/gh/18F/cg-dashboard.svg?style=svg)](https://circleci.com/gh/18F/cg-dashboard)
[![Code Climate](https://codeclimate.com/github/18F/cg-dashboard/badges/gpa.svg)](https://codeclimate.com/github/18F/cg-dashboard)

Environments: [Production](https://dashboard.fr.cloud.gov)
[Staging](https://dashboard.fr-stage.cloud.gov)
[Testing Server](https://dashboard-testing-server.app.cloud.gov)

## Introduction

This dashboard is a web application to manage cloud.gov organizations, spaces, services, and apps.

Learn more about [cloud.gov](https://cloud.gov).

## Tech Stack

### Backend Server

- `Go` (version 1.8)

### Front end application

- `Node` (version 6.x.x)
- `React` (version ^15.0.0)
- `Babel` (version ^6.x.x)
- `Karma` (version ^1.4.x)
- `Webpack` (version ^1.x.x)

## Setup Local Environment

There are two different ways to setup your local environment:

1. **Recommended** Docker+PCFDev [Instructions](devtools/docker-setup.md)
1. Manual [Instructions](devtools/manual-setup.md)

## Deploying

The cloud.gov dashboard is continuously deployed by CircleCI. To deploy manually:

### Bootstrap Deployment Spaces

In each space that you plan on deploying, you need to create a `user-provided-service`.

Run:

```bash
# Create user provided service with config
# See https://github.com/18F/cg-dashboard/blob/master/helpers/env_vars.go for all env variables
cf create-user-provided-service dashboard-ups -p @<(cat <<EOF
{
  "CONSOLE_CLIENT_ID": "your-client-id",
  "CONSOLE_CLIENT_SECRET": "your-client-secret",
  "CSRF_KEY": "$(openssl rand -hex 32)",
  "SESSION_BACKEND": "cookiestore",
  "SESSION_AUTHENTICATION_KEY": "$(openssl rand -hex 64)",
  "SESSION_ENCRYPTION_KEY": "$(openssl rand -hex 32)",
  "SMTP_HOST": "smtp.host.com",
  "SMTP_PORT": "25",
  "SMTP_USER": "username",
  "SMTP_PASS": "password",
  "SMTP_FROM": "from@address.com",
  "CONSOLE_NEW_RELIC_LICENSE": ""
}
EOF
)
```

### Create a Client with UAAC

- Make sure [UAAC](https://github.com/cloudfoundry/cf-uaac) is installed.
- Target your UAA server. `uaac target <uaa.your-domain.com>`
- Login with your current UAA account. `uaac token client get <your admin account> -s <your uaa admin password>`
- Create client account:

```bash
uaac client add <your-client-id> \
 --authorities "uaa.none scim.invite cloud_controller.admin scim.read" \
 --authorized_grant_types authorization_code,client_credentials,refresh_token \
 --scope cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
 --autoapprove true \
-s <your-client-secret>
```

- Unable to create an account still? Troubleshoot [here](https://docs.cloudfoundry.org/adminguide/uaa-user-management.html#creating-admin-users)

### CI

This project uses CircleCI.

- You will need to set up the credentials to deploy to the `dashboard-prod` and `dashboard-stage` spaces.
  - In both spaces run: `cf create-service cloud-gov-service-account space-deployer dashboard-deployer`.
  - You will get the link for that space's credentials by running `cf service dashboard-deployer`.
  - You will need to set these [**secret**](https://circleci.com/docs/1.0/environment-variables/#setting-environment-variables-for-all-commands-without-adding-them-to-git) variables in the [CircleCI UI](https://circleci.com/gh/18F/cg-dashboard/edit#env-vars).
    - `CF_USERNAME_PROD_SPACE` - The username for the `dashboard-prod` deployer
    - `CF_PASSWORD_PROD_SPACE` - The password for the `dashboard-prod` deployer
    - `CF_USERNAME_STAGE_SPACE` - The username for the `dashboard-stage` deployer
    - `CF_PASSWORD_STAGE_SPACE` - The password for the `dashboard-stage` deployer
- If you fork this project for your own use, you will need to use the CircleCI CLI UI to set the variables. (If you're forking just to make a pull request, there's no need to do this.)

### Optional features

Some features can be enabled by supplying the right environment configuration.

#### New Relic Browser

If you have New Relic Browser, you can set your New Relic ID and Browser license
key. These are public and can be set in your manifest file. Note that your
Browser license key is different than your New Relic License Key (which should
be treated as confidential).

```yaml
# manifest.yml
env:
  NEW_RELIC_ID: 12345
  NEW_RELIC_BROWSER_LICENSE_KEY: abcdef
```

#### Google Analytics

If you have a GA site configured, specify your tracking ID as `GA_TRACKING_ID`
in your environment.

```yaml
# manifest.yml
env:
  GA_TRACKING_ID: UA-123456-11
```
