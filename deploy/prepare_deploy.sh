#!/bin/bash

# This script exists in a partial form because when trying to use 'go get' in a script file does not work. 
# Instead we just do the building here.

# Go to the path where the CLI was downloaded and build it.
pushd $CLIPATH
set +e && godep restore && set -e
# Build the cli tool
./bin/build
popd
