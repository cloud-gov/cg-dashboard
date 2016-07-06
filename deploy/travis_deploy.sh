#!/bin/bash

# This script will install the autopilot plugin, login, pick the right manifest and deploy the app with 0 downtime.

# Command line arguments
# $1 = specified org
# $2 = manifest file path
# $3 = file path to project

set -e

CF_PATH="."
if [ "$TRAVIS_BRANCH" == "deprecated" ]
then
	CF_MANIFEST="manifests/manifest-deprecated.yml"
	CF_SPACE="deck-prod"
fi

echo $CF_MANIFEST
echo $CF_SPACE

export CF_BIN=$CLIPATH/out/cf
# Log in
$CF_BIN api $CF_API
$CF_BIN auth $CF_USERNAME $CF_PASSWORD && $CF_BIN target -o $CF_ORGANIZATION -s $CF_SPACE && $CF_BIN install-plugin $GOAUTOPILOT_BIN
# Run autopilot plugin
$CF_BIN zero-downtime-push cg-deck -f $CF_MANIFEST -p $CF_PATH
