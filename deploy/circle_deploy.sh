#!/bin/bash

# This script will install the autopilot plugin, login, pick the right manifest and deploy the app with 0 downtime.

set -e
set -o pipefail

# Install cf cli
curl -v -L -o cf-cli_amd64.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github'
sudo dpkg -i cf-cli_amd64.deb
cf -v

# Install autopilot plugin for blue-green deploys
go get github.com/contraband/autopilot
cf install-plugin -f /home/ubuntu/.go_workspace/bin/autopilot

# Note: Spaces and deployer account username are the same in different environments.
# Only the organization, api, deployer account password differ.


CF_APP="cg-dashboard"
CF_SPACE="dashboard"

if [[ "$CIRCLE_TAG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9-]+)? ]]
then
	CF_MANIFEST="manifest-prod.yml"
	CF_API="https://api.fr.cloud.gov"
	CF_USERNAME=$CF_USERNAME_PROD_SPACE
	CF_PASSWORD=$CF_PASSWORD_PROD_SPACE
elif [ "$CIRCLE_BRANCH" == "master" ]
then
	CF_MANIFEST="manifest-staging.yml"
	CF_API="https://api.fr-stage.cloud.gov"
	CF_USERNAME=$CF_USERNAME_STAGE_SPACE
	CF_PASSWORD=$CF_PASSWORD_STAGE_SPACE
elif [ "$CIRCLE_BRANCH" == "demo" ]
then
	CF_MANIFEST="manifest-demo.yml"
	CF_APP="cg-dashboard-demo"
else
  echo Unknown environment, quitting. >&2
  exit 0
fi

echo manifest: $CF_MANIFEST
echo space:    $CF_SPACE

function deploy () {
  local manifest=${1}
  local org=${2}
  local space=${3}
  local app=${4}

  # Log in
  cf api $CF_API
  cf auth $CF_USERNAME $CF_PASSWORD
  cf target -o $org -s $space

  # Run autopilot plugin
  cf zero-downtime-push $app -f $manifest
}

# Set manifest path
MANIFEST_PATH=manifests/$CF_MANIFEST
deploy "$MANIFEST_PATH" "$CF_ORGANIZATION" "$CF_SPACE" "$CF_APP"
