#!/bin/bash

# This script will install the autopilot plugin, login, pick the right manifest and deploy the app with 0 downtime.

# Command line arguments
# $1 = specified org
# $2 = manifest file path
# $3 = file path to project

set -e

# Note: Spaces and deployer account username are the same in different environments.
# Only the organization, api, deployer account password differ.


CF_PATH="."
if [[ "$TRAVIS_TAG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9-]+)? ]]
then
	CF_MANIFEST="manifest-prod.yml"
	CF_SPACE="deck-prod"
elif [ "$TRAVIS_BRANCH" == "master" ]
then
	CF_MANIFEST="manifest-master.yml"
	CF_SPACE="deck-stage"
elif [ "$TRAVIS_BRANCH" == "staging" ]
then
	CF_MANIFEST="manifest-staging.yml"
	CF_SPACE="deck-stage"
elif [ "$TRAVIS_BRANCH" == "deprecated" ]
then
	CF_MANIFEST="manifest-deprecated.yml"
	CF_SPACE="deck-prod"
else
  exit
fi

echo $CF_MANIFEST
echo $CF_SPACE

export CF_BIN=$CLIPATH/out/cf
# Install autopilot
$CF_BIN install-plugin -f $GOAUTOPILOT_BIN

# Log in to east-west
$CF_BIN api $CF_API
$CF_BIN auth $CF_USERNAME $CF_PASSWORD && $CF_BIN target -o $CF_ORGANIZATION -s $CF_SPACE
# Set manifest path for eastwest
MANIFEST_PATH=manifests/eastwest/$CF_MANIFEST
# Run autopilot plugin
$CF_BIN zero-downtime-push cf-deck -f $MANIFEST_PATH -p $CF_PATH

# Log in to govcloud
$CF_BIN api $CF_API_GC
$CF_BIN auth $CF_USERNAME $CF_PASSWORD_GC && $CF_BIN target -o $CF_ORGANIZATION_GC -s $CF_SPACE
# Set manifest path for eastwest
MANIFEST_PATH=manifests/govcloud/$CF_MANIFEST
# Run autopilot plugin
$CF_BIN zero-downtime-push cf-deck -f $MANIFEST_PATH -p $CF_PATH
