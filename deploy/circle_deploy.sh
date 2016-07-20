#!/bin/bash

# This script will install the autopilot plugin, login, pick the right manifest and deploy the app with 0 downtime.

# Command line arguments
# $1 = specified org
# $2 = manifest file path
# $3 = file path to project

set -e

curl -v -L -o cf-cli_amd64.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github'
sudo dpkg -i cf-cli_amd64.deb
cf -v

# Install autopilot
go get github.com/contraband/autopilot
cf install-plugin -f /home/ubuntu/.go_workspace/bin/autopilot



# Note: Spaces and deployer account username are the same in different environments.
# Only the organization, api, deployer account password differ.


CF_PATH="."
if [[ "$CIRCLE_TAG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9-]+)? ]]
then
	CF_MANIFEST="manifest-prod.yml"
	CF_SPACE="dashboard-prod"
	CF_APP="cg-dashboard"
elif [ "$CIRCLE_BRANCH" == "master" ]
then
	CF_MANIFEST="manifest-master.yml"
	CF_SPACE="dashboard-stage"
	CF_APP="cg-dashboard"
elif [ "$CIRCLE_BRANCH" == "staging" ]
then
	CF_MANIFEST="manifest-staging.yml"
	CF_SPACE="dashboard-stage"
	CF_APP="cg-dashboard-staging"
elif [ "$CIRCLE_BRANCH" == "deprecated" ]
then
	CF_MANIFEST="manifest-deprecated.yml"
	CF_SPACE="dashboard-prod"
	CF_APP="cg-deck"
else
  exit
fi

echo $CF_MANIFEST
echo $CF_SPACE


# Log in to east-west
cf api $CF_API
cf auth $CF_USERNAME $CF_PASSWORD && $CF_BIN target -o $CF_ORGANIZATION -s $CF_SPACE
# Set manifest path for eastwest
MANIFEST_PATH=manifests/eastwest/$CF_MANIFEST
# Run autopilot plugin
cf zero-downtime-push $CF_APP -f $MANIFEST_PATH -p $CF_PATH

# Log in to govcloud
cf api $CF_API_GC
cf auth $CF_USERNAME $CF_PASSWORD_GC && $CF_BIN target -o $CF_ORGANIZATION_GC -s $CF_SPACE
# Set manifest path for eastwest
MANIFEST_PATH=manifests/govcloud/$CF_MANIFEST
# Run autopilot plugin
cf zero-downtime-push $CF_APP -f $MANIFEST_PATH -p $CF_PATH
